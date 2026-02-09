#!/bin/bash

# Batch Experiment Runner
# Runs all kata/workflow combinations automatically

set -e

EXPERIMENTS_DIR="/home/experimenter/experiments"
KATAS_DIR="$EXPERIMENTS_DIR/katas"
WORKFLOWS_DIR="$EXPERIMENTS_DIR/workflows"
RUNS_DIR="$EXPERIMENTS_DIR/runs"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  TDD Experiment Batch Runner${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Get all katas and workflows (skip those starting with _)
all_katas=($(ls -d "$KATAS_DIR"/*/ 2>/dev/null | xargs -n1 basename))
all_workflows=($(ls -d "$WORKFLOWS_DIR"/*/ 2>/dev/null | xargs -n1 basename))

# Filter out disabled items (starting with _)
katas=()
skipped_katas=()
for k in "${all_katas[@]}"; do
    if [[ "$k" == _* ]]; then
        skipped_katas+=("$k")
    else
        katas+=("$k")
    fi
done

workflows=()
skipped_workflows=()
for w in "${all_workflows[@]}"; do
    if [[ "$w" == _* ]]; then
        skipped_workflows+=("$w")
    else
        workflows+=("$w")
    fi
done

echo -e "\n${YELLOW}Found ${#katas[@]} katas: ${katas[*]}${NC}"
echo -e "${YELLOW}Found ${#workflows[@]} workflows: ${workflows[*]}${NC}"

if [ ${#skipped_katas[@]} -gt 0 ]; then
    echo -e "${YELLOW}Skipped katas (disabled with _ prefix): ${skipped_katas[*]}${NC}"
fi
if [ ${#skipped_workflows[@]} -gt 0 ]; then
    echo -e "${YELLOW}Skipped workflows (disabled with _ prefix): ${skipped_workflows[*]}${NC}"
fi

# Calculate total runs
total=$((${#katas[@]} * ${#workflows[@]}))
current=0

echo -e "\n${BLUE}Running $total experiments...${NC}\n"

# Run each combination
for kata in "${katas[@]}"; do
    for workflow in "${workflows[@]}"; do
        current=$((current + 1))
        echo -e "${YELLOW}[$current/$total] Running: $kata + $workflow${NC}"

        # Create run directory
        timestamp=$(date +%Y-%m-%d_%H-%M-%S)
        run_name="${timestamp}_${kata}_${workflow}"
        run_dir="$RUNS_DIR/$run_name"

        mkdir -p "$run_dir/src"

        # Copy workflow config
        if [ -d "$WORKFLOWS_DIR/$workflow/.claude" ]; then
            cp -r "$WORKFLOWS_DIR/$workflow/.claude" "$run_dir/"
        fi

        # Copy kata prompt
        if [ -f "$KATAS_DIR/$kata/prompt.md" ]; then
            cp "$KATAS_DIR/$kata/prompt.md" "$run_dir/"
        fi

        # Create package.json
        cat > "$run_dir/package.json" << 'EOF'
{
  "name": "tdd-experiment-run",
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:unit:basic": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  }
}
EOF

        # Create tsconfig.json
        cat > "$run_dir/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
EOF

        # Create vitest.config.ts
        cat > "$run_dir/vitest.config.ts" << 'EOF'
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts'],
    globals: true,
  },
});
EOF

        # Record start
        cat > "$run_dir/metrics.json" << EOF
{
  "kata": "$kata",
  "workflow": "$workflow",
  "started_at": "$(date -Iseconds)",
  "ended_at": null,
  "duration_seconds": null,
  "batch_run": true
}
EOF

        # Install dependencies
        echo -e "  Installing dependencies..."
        (cd "$run_dir" && pnpm install --silent 2>/dev/null) || true

        # Run Claude (using --print for non-interactive mode)
        echo -e "  Running Claude Code..."
        start_time=$(date +%s)

        cd "$run_dir"
        claude --dangerously-skip-permissions --print \
            "Read prompt.md and complete the TDD exercise following the workflow rules." \
            2>&1 | tee "$run_dir/claude-output.log" || {
            echo -e "  ${RED}Run failed${NC}"
        }
        cd "$EXPERIMENTS_DIR"

        # Record end
        end_time=$(date +%s)
        duration=$((end_time - start_time))

        if command -v jq &> /dev/null; then
            jq --arg ended "$(date -Iseconds)" \
               --argjson duration "$duration" \
               '.ended_at = $ended | .duration_seconds = $duration' \
               "$run_dir/metrics.json" > "$run_dir/metrics.tmp" && \
            mv "$run_dir/metrics.tmp" "$run_dir/metrics.json"
        fi

        # Run analysis
        echo -e "  Analyzing results..."
        "$EXPERIMENTS_DIR/analyze-run.sh" "$run_dir" > /dev/null 2>&1 || true

        echo -e "  ${GREEN}Completed in ${duration}s${NC}\n"

        # Brief pause between runs
        sleep 5
    done
done

echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Batch Complete: $total experiments${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "\n${YELLOW}Results saved to: $RUNS_DIR${NC}"
