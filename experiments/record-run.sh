#!/bin/bash

# TDD Workflow Experiment Runner
# Records metrics from TDD runs for comparison

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
EXPERIMENTS_DIR="$(cd "$(dirname "$0")" && pwd)"
KATAS_DIR="$EXPERIMENTS_DIR/katas"
WORKFLOWS_DIR="$EXPERIMENTS_DIR/workflows"
RUNS_DIR="$EXPERIMENTS_DIR/runs"

# Functions
print_header() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  TDD Workflow Experiment Runner${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
}

list_katas() {
    echo -e "\n${YELLOW}Available Katas:${NC}"
    local i=1
    for kata in "$KATAS_DIR"/*/; do
        if [ -d "$kata" ]; then
            echo "  $i) $(basename "$kata")"
            ((i++))
        fi
    done
}

list_workflows() {
    echo -e "\n${YELLOW}Available Workflows:${NC}"
    local i=1
    for workflow in "$WORKFLOWS_DIR"/*/; do
        if [ -d "$workflow" ]; then
            echo "  $i) $(basename "$workflow")"
            ((i++))
        fi
    done
}

create_run_dir() {
    local kata=$1
    local workflow=$2
    local timestamp=$(date +%Y-%m-%d_%H-%M-%S)
    local run_name="${timestamp}_${kata}_${workflow}"
    local run_dir="$RUNS_DIR/$run_name"

    mkdir -p "$run_dir/src"
    echo "$run_dir"
}

setup_run() {
    local run_dir=$1
    local workflow=$2
    local kata=$3

    # Copy workflow config
    if [ -d "$WORKFLOWS_DIR/$workflow/.claude" ]; then
        cp -r "$WORKFLOWS_DIR/$workflow/.claude" "$run_dir/"
    fi

    # Copy kata prompt
    if [ -f "$KATAS_DIR/$kata/prompt.md" ]; then
        cp "$KATAS_DIR/$kata/prompt.md" "$run_dir/"
    fi

    # Create package.json for tests
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
}

record_start() {
    local run_dir=$1
    local kata=$2
    local workflow=$3

    cat > "$run_dir/metrics.json" << EOF
{
  "kata": "$kata",
  "workflow": "$workflow",
  "started_at": "$(date -Iseconds)",
  "ended_at": null,
  "duration_seconds": null,
  "phases": [],
  "final_metrics": {
    "tests_total": null,
    "tests_passing": null,
    "code_mass": null,
    "lines_of_code": null,
    "refactorings_count": null
  }
}
EOF
}

record_end() {
    local run_dir=$1
    local start_time=$2
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    # Update metrics with end time and duration
    if command -v jq &> /dev/null; then
        jq --arg ended "$(date -Iseconds)" \
           --argjson duration "$duration" \
           '.ended_at = $ended | .duration_seconds = $duration' \
           "$run_dir/metrics.json" > "$run_dir/metrics.tmp" && \
        mv "$run_dir/metrics.tmp" "$run_dir/metrics.json"
    fi

    # Collect code metrics
    if [ -f "$run_dir/src/string-calculator.ts" ]; then
        local loc=$(wc -l < "$run_dir/src/string-calculator.ts" 2>/dev/null || echo "0")
        echo -e "${GREEN}Lines of code: $loc${NC}"
    fi

    # Count tests
    if [ -f "$run_dir/src/string-calculator.spec.ts" ]; then
        local tests=$(grep -c "it(" "$run_dir/src/string-calculator.spec.ts" 2>/dev/null || echo "0")
        echo -e "${GREEN}Tests: $tests${NC}"
    fi
}

install_dependencies() {
    local run_dir=$1

    echo -e "\n${YELLOW}Installing dependencies...${NC}"
    (cd "$run_dir" && pnpm install --silent)
    echo -e "${GREEN}Dependencies installed.${NC}"
}

run_claude() {
    local run_dir=$1
    local kata=$2

    echo -e "\n${YELLOW}Starting Claude Code...${NC}"
    echo -e "${BLUE}Prompt: Read prompt.md and complete the TDD exercise following the workflow rules.${NC}\n"

    # Start Claude Code in non-interactive mode
    # --dangerously-skip-permissions: Skip all permission prompts
    # --print: Print response and exit (non-interactive mode)
    (cd "$run_dir" && claude --dangerously-skip-permissions --print "Read prompt.md and complete the TDD exercise following the workflow rules.")
}

print_completion() {
    local run_dir=$1

    echo -e "\n${GREEN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  Experiment Complete${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "\n${YELLOW}Run directory:${NC} $run_dir"
    echo -e "\n${YELLOW}To analyze results:${NC}"
    echo "  $EXPERIMENTS_DIR/analyze-run.sh $run_dir"
}

# Main
print_header

# Select kata
list_katas
echo -e "\n${YELLOW}Select kata (number):${NC} "
read -r kata_num

katas=("$KATAS_DIR"/*/)
kata_idx=$((kata_num - 1))
if [ $kata_idx -lt 0 ] || [ $kata_idx -ge ${#katas[@]} ]; then
    echo -e "${RED}Invalid selection${NC}"
    exit 1
fi
selected_kata=$(basename "${katas[$kata_idx]}")

# Select workflow
list_workflows
echo -e "\n${YELLOW}Select workflow (number):${NC} "
read -r workflow_num

workflows=("$WORKFLOWS_DIR"/*/)
workflow_idx=$((workflow_num - 1))
if [ $workflow_idx -lt 0 ] || [ $workflow_idx -ge ${#workflows[@]} ]; then
    echo -e "${RED}Invalid selection${NC}"
    exit 1
fi
selected_workflow=$(basename "${workflows[$workflow_idx]}")

echo -e "\n${BLUE}Creating run: $selected_kata + $selected_workflow${NC}"

# Create and setup run
run_dir=$(create_run_dir "$selected_kata" "$selected_workflow")
setup_run "$run_dir" "$selected_workflow" "$selected_kata"
record_start "$run_dir" "$selected_kata" "$selected_workflow"

# Install dependencies
install_dependencies "$run_dir"

# Run Claude Code
start_time=$(date +%s)
run_claude "$run_dir" "$selected_kata"

# Record end metrics
record_end "$run_dir" "$start_time"

# Run analysis automatically
echo -e "\n${YELLOW}Running analysis...${NC}"
"$EXPERIMENTS_DIR/analyze-run.sh" "$run_dir"

# Print completion message
print_completion "$run_dir"
