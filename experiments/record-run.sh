#!/bin/bash

# TDD Workflow Experiment Runner
# Records metrics from TDD runs for comparison

set -e

# Hard timeout for the Claude Code call (seconds). Override via env var.
# 1800s = 30 min — long enough for most TDD runs, short enough to avoid
# hanging indefinitely on rate-limit waits or stuck sessions.
CLAUDE_TIMEOUT_SECONDS="${CLAUDE_TIMEOUT_SECONDS:-1800}"

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
            local name=$(basename "$kata")
            # Skip disabled katas (starting with _)
            if [[ "$name" == _* ]]; then
                echo -e "  ${RED}$i) $name (disabled)${NC}"
            else
                echo "  $i) $name"
            fi
            ((i++))
        fi
    done
}

list_workflows() {
    echo -e "\n${YELLOW}Available Workflows:${NC}"
    local i=1
    for workflow in "$WORKFLOWS_DIR"/*/; do
        if [ -d "$workflow" ]; then
            local name=$(basename "$workflow")
            # Skip disabled workflows (starting with _)
            if [[ "$name" == _* ]]; then
                echo -e "  ${RED}$i) $name (disabled)${NC}"
            else
                echo "  $i) $name"
            fi
            ((i++))
        fi
    done
}

# Model configurations: name|cli_model|thinking_enabled
# cli_model is the explicit Claude API ID (not the short alias like
# `opus`/`sonnet`), since the short aliases currently resolve to legacy
# versions (`opus` -> claude-opus-4-6, not 4.7). Pinning the full ID
# guarantees we run the model we mean to run.
MODEL_CONFIGS=(
    "opus-4-7|claude-opus-4-7|true"
    "opus-4-7-no-thinking|claude-opus-4-7|false"
    "sonnet-4-6|claude-sonnet-4-6|true"
    "sonnet-4-6-no-thinking|claude-sonnet-4-6|false"
    "haiku-4-5|claude-haiku-4-5-20251001|true"
    "haiku-4-5-no-thinking|claude-haiku-4-5-20251001|false"
)

list_models() {
    echo -e "\n${YELLOW}Available Models:${NC}"
    local i=1
    for config in "${MODEL_CONFIGS[@]}"; do
        local name=$(echo "$config" | cut -d'|' -f1)
        local cli_model=$(echo "$config" | cut -d'|' -f2)
        local thinking=$(echo "$config" | cut -d'|' -f3)
        local thinking_label="with thinking"
        [ "$thinking" = "false" ] && thinking_label="without thinking"
        echo "  $i) $name ($cli_model, $thinking_label)"
        ((i++))
    done
}

get_model_cli_name() {
    local config=$1
    echo "$config" | cut -d'|' -f2
}

get_model_thinking() {
    local config=$1
    echo "$config" | cut -d'|' -f3
}

get_model_name() {
    local config=$1
    echo "$config" | cut -d'|' -f1
}

create_run_dir() {
    local kata=$1
    local workflow=$2
    local model=$3
    local timestamp=$(date +%Y-%m-%d_%H-%M-%S)
    local run_name="${timestamp}_${kata}_${workflow}_${model}"
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
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage --coverage.reporter=json-summary",
    "lint:smells": "eslint src/**/*.ts --no-eslintrc --config eslint.config.mjs --format json"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vitest": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0",
    "eslint": "^9.0.0",
    "eslint-plugin-sonarjs": "^3.0.0",
    "typescript-eslint": "^8.0.0"
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
    coverage: {
      provider: 'v8',
      reporter: ['json-summary', 'text'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts'],
    },
  },
});
EOF

    # Create ESLint config for code smell detection
    cat > "$run_dir/eslint.config.mjs" << 'EOF'
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["src/**/*.ts"],
    ignores: ["src/**/*.spec.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      sonarjs,
    },
    rules: {
      // Complexity smells
      "sonarjs/cognitive-complexity": ["error", 10],
      "max-depth": ["error", 3],
      "max-lines-per-function": ["error", { max: 30, skipBlankLines: true, skipComments: true }],
      "max-params": ["error", 4],

      // Duplication smells
      "sonarjs/no-duplicate-string": ["error", { threshold: 3 }],
      "sonarjs/no-duplicated-branches": "error",
      "sonarjs/no-identical-functions": "error",

      // Dead code smells
      "no-unused-vars": "off",
      "sonarjs/no-unused-collection": "error",
      "no-unreachable": "error",

      // Magic numbers
      "no-magic-numbers": ["error", { ignore: [0, 1, -1], ignoreArrayIndexes: true }],

      // Boolean/logic smells
      "sonarjs/no-redundant-boolean": "error",
      "sonarjs/no-gratuitous-expressions": "error",

      // Code quality smells
      "sonarjs/no-collapsible-if": "error",
      "sonarjs/no-redundant-jump": "error",
      "sonarjs/no-useless-catch": "error",
      "sonarjs/prefer-immediate-return": "error",
      "sonarjs/prefer-single-boolean-return": "error",

      // Nested complexity
      "sonarjs/no-nested-switch": "error",
      "sonarjs/no-nested-template-literals": "error",
    },
  },
];
EOF
}

record_start() {
    local run_dir=$1
    local kata=$2
    local workflow=$3
    local model_name=$4
    local thinking=$5

    cat > "$run_dir/metrics.json" << EOF
{
  "kata": "$kata",
  "workflow": "$workflow",
  "model": "$model_name",
  "thinking": $thinking,
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

    # Pull the exit info that run_claude stashed (if any).
    local exit_code="null"
    local exit_reason="unknown"
    local rate_limited="false"
    [ -f "$run_dir/.claude_exit_code" ]    && exit_code=$(cat "$run_dir/.claude_exit_code")
    [ -f "$run_dir/.claude_exit_reason" ]  && exit_reason=$(cat "$run_dir/.claude_exit_reason")
    [ -f "$run_dir/.claude_rate_limited" ] && rate_limited=$(cat "$run_dir/.claude_rate_limited")

    # Update metrics with end time, duration, and run status.
    if command -v jq &> /dev/null && [ -f "$run_dir/metrics.json" ]; then
        jq --arg ended "$(date -Iseconds)" \
           --argjson duration "$duration" \
           --argjson exit_code "$exit_code" \
           --arg exit_reason "$exit_reason" \
           --argjson rate_limited "$rate_limited" \
           '.ended_at = $ended
            | .duration_seconds = $duration
            | .run_status = {
                exit_code: $exit_code,
                exit_reason: $exit_reason,
                rate_limited: $rate_limited
              }' \
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
    local cli_model=$3
    local thinking=$4

    echo -e "\n${YELLOW}Starting Claude Code...${NC}"
    echo -e "${BLUE}Model: $cli_model | Thinking: $thinking${NC}"
    echo -e "${BLUE}Timeout: ${CLAUDE_TIMEOUT_SECONDS}s${NC}"
    echo -e "${BLUE}Prompt: Read prompt.md and complete the TDD exercise following the workflow rules.${NC}\n"

    local run_log="$run_dir/run.log"
    local claude_exit=0

    # Start Claude Code in non-interactive mode
    # --dangerously-skip-permissions: Skip all permission prompts
    # --print: Print response and exit (non-interactive mode)
    # --model: Select the model (opus, sonnet, or full ID)
    # MAX_THINKING_TOKENS=0: Disable extended thinking when thinking=false
    #
    # Wrap with `timeout` so a stuck or rate-limited session can't hang the
    # whole pipeline indefinitely. Disable `set -e` around the call so a
    # non-zero exit (timeout, rate limit, crash) still lets us save the
    # transcript and analyze whatever was produced.
    set +e
    if [ "$thinking" = "false" ]; then
        (cd "$run_dir" && MAX_THINKING_TOKENS=0 timeout --signal=TERM --kill-after=30s "$CLAUDE_TIMEOUT_SECONDS" \
            claude --dangerously-skip-permissions --model "$cli_model" --print \
            "Read prompt.md and complete the TDD exercise following the workflow rules.") \
            2>&1 | tee "$run_log"
        claude_exit=${PIPESTATUS[0]}
    else
        (cd "$run_dir" && timeout --signal=TERM --kill-after=30s "$CLAUDE_TIMEOUT_SECONDS" \
            claude --dangerously-skip-permissions --model "$cli_model" --print \
            "Read prompt.md and complete the TDD exercise following the workflow rules.") \
            2>&1 | tee "$run_log"
        claude_exit=${PIPESTATUS[0]}
    fi
    set -e

    # Annotate exit reason for later inspection. `timeout` exits 124 on
    # signal, 137 if the process had to be SIGKILL'd. Anything else is the
    # tool's own exit code (0 = success, non-zero = error/rate-limit).
    local exit_reason="ok"
    case "$claude_exit" in
        0)   exit_reason="ok" ;;
        124) exit_reason="timeout" ;;
        137) exit_reason="timeout-killed" ;;
        *)   exit_reason="error-$claude_exit" ;;
    esac

    # Heuristic: detect rate-limit / overload mentions in the run log.
    # We don't try to be exhaustive — the log is also kept on disk for
    # manual inspection.
    local rate_limited="false"
    if grep -qiE "rate.?limit|429|usage limit|overloaded" "$run_log" 2>/dev/null; then
        rate_limited="true"
        exit_reason="rate-limited"
    fi

    echo -e "\n${YELLOW}Claude exited with code $claude_exit ($exit_reason)${NC}"

    # Stash the result so record_end can fold it into metrics.json.
    echo "$claude_exit" > "$run_dir/.claude_exit_code"
    echo "$exit_reason" > "$run_dir/.claude_exit_reason"
    echo "$rate_limited" > "$run_dir/.claude_rate_limited"
}

save_transcript() {
    local run_dir=$1

    # Map run_dir to Claude project dir name: Claude Code replaces all
    # non-alphanumeric characters (slashes, underscores, colons, etc.) with "-".
    # Claude Code writes session JSONLs to ~/.claude/projects/<dashed-path>/<uuid>.jsonl
    local dashed_path
    dashed_path=$(echo "$run_dir" | sed 's|[^a-zA-Z0-9]|-|g')
    local home_dir="${HOME:-/root}"
    local project_dir="$home_dir/.claude/projects/$dashed_path"

    if [ ! -d "$project_dir" ]; then
        echo -e "${YELLOW}Transcript project dir not found: $project_dir${NC}"
        return
    fi

    # Pick the most recently modified <uuid>.jsonl as the main session transcript.
    local newest_jsonl
    newest_jsonl=$(ls -t "$project_dir"/*.jsonl 2>/dev/null | head -1)

    if [ -z "$newest_jsonl" ] || [ ! -f "$newest_jsonl" ]; then
        echo -e "${YELLOW}No transcript JSONL found in $project_dir${NC}"
        return
    fi

    cp "$newest_jsonl" "$run_dir/transcript.jsonl"
    echo -e "${GREEN}Saved transcript: $run_dir/transcript.jsonl${NC}"

    # Subagent transcripts (v4) live under <project_dir>/<uuid>/subagents/agent-*.jsonl
    local session_uuid
    session_uuid=$(basename "$newest_jsonl" .jsonl)
    local subagent_src="$project_dir/$session_uuid/subagents"
    if [ -d "$subagent_src" ]; then
        local count
        count=$(ls -1 "$subagent_src"/agent-*.jsonl 2>/dev/null | wc -l | tr -d '[:space:]')
        if [ "$count" -gt 0 ]; then
            mkdir -p "$run_dir/transcript-subagents"
            cp "$subagent_src"/agent-*.jsonl "$run_dir/transcript-subagents/"
            # Also copy per-agent meta files; analyze_transcript.py uses the
            # agentType field to identify red-phase agents for prediction counts.
            cp "$subagent_src"/agent-*.meta.json "$run_dir/transcript-subagents/" 2>/dev/null || true
            echo -e "${GREEN}Saved $count subagent transcripts${NC}"
        fi
    fi
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

# Select model
list_models
echo -e "\n${YELLOW}Select model (number):${NC} "
read -r model_num

model_idx=$((model_num - 1))
if [ $model_idx -lt 0 ] || [ $model_idx -ge ${#MODEL_CONFIGS[@]} ]; then
    echo -e "${RED}Invalid selection${NC}"
    exit 1
fi
selected_model_config="${MODEL_CONFIGS[$model_idx]}"
selected_model=$(get_model_name "$selected_model_config")
selected_cli_model=$(get_model_cli_name "$selected_model_config")
selected_thinking=$(get_model_thinking "$selected_model_config")

echo -e "\n${BLUE}Creating run: $selected_kata + $selected_workflow + $selected_model${NC}"

# Create and setup run
run_dir=$(create_run_dir "$selected_kata" "$selected_workflow" "$selected_model")
setup_run "$run_dir" "$selected_workflow" "$selected_kata"
record_start "$run_dir" "$selected_kata" "$selected_workflow" "$selected_model" "$selected_thinking"

# Capture run state for the cleanup trap. If the script aborts (Ctrl-C,
# `set -e` failure, parent SIGTERM) we still want the transcript copied
# and metrics finalised so the partial run is debuggable.
start_time=$(date +%s)
RUN_DIR_FOR_TRAP="$run_dir"
RUN_START_FOR_TRAP="$start_time"
RUN_FINALIZED=0

cleanup_on_exit() {
    # Idempotent: only run finalisation once, even if the trap fires
    # multiple times (EXIT after INT etc.).
    if [ "$RUN_FINALIZED" = "1" ]; then
        return
    fi
    RUN_FINALIZED=1

    if [ -n "$RUN_DIR_FOR_TRAP" ] && [ -d "$RUN_DIR_FOR_TRAP" ]; then
        echo -e "\n${YELLOW}Finalising run (trap)...${NC}"
        save_transcript "$RUN_DIR_FOR_TRAP" || true
        record_end "$RUN_DIR_FOR_TRAP" "$RUN_START_FOR_TRAP" || true
    fi
}
trap cleanup_on_exit EXIT INT TERM

# Install dependencies
install_dependencies "$run_dir"

# Run Claude Code
run_claude "$run_dir" "$selected_kata" "$selected_cli_model" "$selected_thinking"

# Save Claude Code transcript before any further bookkeeping
save_transcript "$run_dir"

# Record end metrics
record_end "$run_dir" "$start_time"

# Mark finalisation done so the EXIT trap doesn't redo the work.
RUN_FINALIZED=1

# Run analysis automatically (skip if Claude was rate-limited or timed out
# and produced no source files — analyze-run would just error out).
if [ -f "$run_dir/.claude_rate_limited" ] && [ "$(cat "$run_dir/.claude_rate_limited")" = "true" ]; then
    echo -e "\n${RED}Claude appears to have been rate-limited.${NC}"
    echo -e "${YELLOW}Run log: $run_dir/run.log${NC}"
    echo -e "${YELLOW}Skipping automatic analysis. Re-run analyze-run.sh manually if desired.${NC}"
else
    echo -e "\n${YELLOW}Running analysis...${NC}"
    "$EXPERIMENTS_DIR/analyze-run.sh" "$run_dir" || \
        echo -e "${YELLOW}Analysis failed; run dir preserved at $run_dir${NC}"
fi

# Print completion message
print_completion "$run_dir"
