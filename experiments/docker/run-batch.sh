#!/bin/bash

# Batch Experiment Runner
# Runs experiments either as a full cross-product (default) or from an
# explicit JSON plan file passed via --plan.

set -e

EXPERIMENTS_DIR="/home/experimenter/experiments"
KATAS_DIR="$EXPERIMENTS_DIR/katas"
WORKFLOWS_DIR="$EXPERIMENTS_DIR/workflows"
RUNS_DIR="$EXPERIMENTS_DIR/runs"
BATCH_PLANS_DIR="$EXPERIMENTS_DIR/batch-plans"

# Hard timeout for a single Claude Code call (seconds). Override via env.
CLAUDE_TIMEOUT_SECONDS="${CLAUDE_TIMEOUT_SECONDS:-1800}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# ---------------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------------

PLAN_FILE=""

usage() {
    cat <<EOF
Usage: run-batch.sh [--plan PATH]

Options:
  --plan PATH    Path to a JSON plan file with explicit run triples.
                 Format:
                   {
                     "name": "optional plan name",
                     "description": "optional description",
                     "runs": [
                       { "kata": "...", "workflow": "...", "model": "..." },
                       ...
                     ]
                   }
                 'model' is the model name from MODEL_CONFIGS (e.g.
                 "sonnet-4-6", "opus-4-7-no-thinking"), not the full API ID.
                 Plan paths inside the container default to looking in
                 ${BATCH_PLANS_DIR}/ if PATH is just a filename.

  -h, --help     Show this help.

Without --plan, the batch runs the full cross-product of all enabled katas,
all enabled workflows, and all model configurations.
EOF
}

while [ $# -gt 0 ]; do
    case "$1" in
        --plan)
            PLAN_FILE="$2"
            shift 2
            ;;
        --plan=*)
            PLAN_FILE="${1#--plan=}"
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown argument: $1${NC}" >&2
            usage >&2
            exit 2
            ;;
    esac
done

# Resolve bare filename against $BATCH_PLANS_DIR for convenience.
if [ -n "$PLAN_FILE" ] && [ ! -f "$PLAN_FILE" ] && [ -f "$BATCH_PLANS_DIR/$PLAN_FILE" ]; then
    PLAN_FILE="$BATCH_PLANS_DIR/$PLAN_FILE"
fi

if [ -n "$PLAN_FILE" ] && [ ! -f "$PLAN_FILE" ]; then
    echo -e "${RED}Plan file not found: $PLAN_FILE${NC}" >&2
    exit 2
fi

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

print_header() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  TDD Experiment Batch Runner${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
}

# Look up a MODEL_CONFIGS entry by its name (first field).
# Echoes the full pipe-delimited config string, or empty if not found.
lookup_model_config() {
    local name="$1"
    for cfg in "${MODEL_CONFIGS[@]}"; do
        if [ "$(echo "$cfg" | cut -d'|' -f1)" = "$name" ]; then
            echo "$cfg"
            return 0
        fi
    done
    return 1
}

# List enabled (non-underscore-prefixed) entries from a directory.
list_enabled() {
    local base="$1"
    local entry
    for entry in "$base"/*/; do
        [ -d "$entry" ] || continue
        local name
        name="$(basename "$entry")"
        [[ "$name" == _* ]] && continue
        echo "$name"
    done
}

# ---------------------------------------------------------------------------
# Build run list (either from --plan or as full cross-product)
# ---------------------------------------------------------------------------

# RUN_LIST holds entries shaped as: kata|workflow|model_name
RUN_LIST=()
PLAN_NAME=""
PLAN_DESCRIPTION=""

if [ -n "$PLAN_FILE" ]; then
    if ! command -v jq >/dev/null 2>&1; then
        echo -e "${RED}jq is required to parse plan files but was not found.${NC}" >&2
        exit 3
    fi

    if ! jq empty "$PLAN_FILE" >/dev/null 2>&1; then
        echo -e "${RED}Plan file is not valid JSON: $PLAN_FILE${NC}" >&2
        exit 3
    fi

    PLAN_NAME=$(jq -r '.name // ""' "$PLAN_FILE")
    PLAN_DESCRIPTION=$(jq -r '.description // ""' "$PLAN_FILE")

    # Pull triples; each line: kata\tworkflow\tmodel
    triple_count=$(jq '.runs | length' "$PLAN_FILE" 2>/dev/null || echo 0)
    if [ "$triple_count" = "null" ] || [ "$triple_count" = "0" ]; then
        echo -e "${RED}Plan file has no runs: $PLAN_FILE${NC}" >&2
        exit 3
    fi

    # --- Validation (fail-fast) ---
    errors=()
    while IFS=$'\t' read -r kata workflow model; do
        if [ -z "$kata" ] || [ -z "$workflow" ] || [ -z "$model" ]; then
            errors+=("missing kata/workflow/model in entry: '$kata' '$workflow' '$model'")
            continue
        fi
        if [ ! -d "$KATAS_DIR/$kata" ]; then
            errors+=("unknown kata: '$kata'")
        fi
        if [ ! -d "$WORKFLOWS_DIR/$workflow" ]; then
            errors+=("unknown workflow: '$workflow'")
        fi
        if ! lookup_model_config "$model" >/dev/null; then
            errors+=("unknown model: '$model'")
        fi
        RUN_LIST+=("$kata|$workflow|$model")
    done < <(jq -r '.runs[] | [.kata, .workflow, .model] | @tsv' "$PLAN_FILE")

    if [ ${#errors[@]} -gt 0 ]; then
        echo -e "${RED}Plan validation failed:${NC}" >&2
        for e in "${errors[@]}"; do
            echo -e "${RED}  - $e${NC}" >&2
        done
        echo
        echo -e "${YELLOW}Available katas:${NC}    $(list_enabled "$KATAS_DIR" | tr '\n' ' ')" >&2
        echo -e "${YELLOW}Available workflows:${NC} $(list_enabled "$WORKFLOWS_DIR" | tr '\n' ' ')" >&2
        echo -e "${YELLOW}Available models:${NC}   $(printf '%s ' "${MODEL_CONFIGS[@]}" | sed 's/|[^| ]*|[^ ]*//g')" >&2
        exit 3
    fi
else
    # Full cross-product mode
    mapfile -t katas < <(list_enabled "$KATAS_DIR")
    mapfile -t workflows < <(list_enabled "$WORKFLOWS_DIR")

    for kata in "${katas[@]}"; do
        for workflow in "${workflows[@]}"; do
            for cfg in "${MODEL_CONFIGS[@]}"; do
                model_name=$(echo "$cfg" | cut -d'|' -f1)
                RUN_LIST+=("$kata|$workflow|$model_name")
            done
        done
    done
fi

# ---------------------------------------------------------------------------
# Header / preview
# ---------------------------------------------------------------------------

print_header

if [ -n "$PLAN_FILE" ]; then
    echo -e "${BLUE}Mode:${NC} plan file"
    echo -e "${BLUE}Plan:${NC} $PLAN_FILE"
    [ -n "$PLAN_NAME" ]        && echo -e "${BLUE}Name:${NC} $PLAN_NAME"
    [ -n "$PLAN_DESCRIPTION" ] && echo -e "${BLUE}Description:${NC} $PLAN_DESCRIPTION"
else
    echo -e "${BLUE}Mode:${NC} full cross-product"
fi

total=${#RUN_LIST[@]}
echo -e "${BLUE}Total runs:${NC} $total"
echo -e "${BLUE}Per-run timeout:${NC} ${CLAUDE_TIMEOUT_SECONDS}s"
echo

# ---------------------------------------------------------------------------
# Run loop
# ---------------------------------------------------------------------------

current=0
ok_count=0
failed_count=0
ratelimited_count=0

for entry in "${RUN_LIST[@]}"; do
    kata=$(echo "$entry" | cut -d'|' -f1)
    workflow=$(echo "$entry" | cut -d'|' -f2)
    model_name=$(echo "$entry" | cut -d'|' -f3)
    cfg="$(lookup_model_config "$model_name")"
    cli_model=$(echo "$cfg" | cut -d'|' -f2)
    thinking=$(echo "$cfg" | cut -d'|' -f3)

    current=$((current + 1))
    echo -e "${YELLOW}[$current/$total] $kata + $workflow + $model_name${NC}"

    # Create run directory
    timestamp=$(date +%Y-%m-%d_%H-%M-%S)
    run_name="${timestamp}_${kata}_${workflow}_${model_name}"
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

    # Project files
    cat > "$run_dir/package.json" << 'EOF'
{
  "name": "tdd-experiment-run",
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:unit:basic": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage --coverage.reporter=json-summary"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vitest": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0"
  }
}
EOF

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

    # Record start
    cat > "$run_dir/metrics.json" << EOF
{
  "kata": "$kata",
  "workflow": "$workflow",
  "model": "$model_name",
  "thinking": $thinking,
  "started_at": "$(date -Iseconds)",
  "ended_at": null,
  "duration_seconds": null,
  "batch_run": true,
  "plan_file": $( [ -n "$PLAN_FILE" ] && echo "\"$PLAN_FILE\"" || echo "null" )
}
EOF

    # Install dependencies
    echo -e "  Installing dependencies..."
    (cd "$run_dir" && pnpm install --silent 2>/dev/null) || true

    # Run Claude Code with timeout + capture log + tolerate non-zero exit.
    echo -e "  Running Claude Code... (model: $cli_model, thinking: $thinking)"
    start_time=$(date +%s)
    run_log="$run_dir/run.log"
    claude_exit=0

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

    # Map exit code to a human-readable reason.
    case "$claude_exit" in
        0)   exit_reason="ok" ;;
        124) exit_reason="timeout" ;;
        137) exit_reason="timeout-killed" ;;
        *)   exit_reason="error-$claude_exit" ;;
    esac

    rate_limited="false"
    if grep -qiE "rate.?limit|429|usage limit|overloaded" "$run_log" 2>/dev/null; then
        rate_limited="true"
        exit_reason="rate-limited"
    fi

    end_time=$(date +%s)
    duration=$((end_time - start_time))

    # Update metrics with end time, duration, and run status
    if command -v jq &>/dev/null; then
        jq --arg ended "$(date -Iseconds)" \
           --argjson duration "$duration" \
           --argjson exit_code "$claude_exit" \
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

    # Tally + skip analysis on rate-limit (no source produced anyway).
    if [ "$rate_limited" = "true" ]; then
        ratelimited_count=$((ratelimited_count + 1))
        echo -e "  ${RED}Rate-limited (${duration}s). Skipping analysis.${NC}"
        echo -e "  ${YELLOW}Aborting batch to avoid burning more requests.${NC}"
        echo -e "  ${YELLOW}Resume later by editing the plan file or using batch-retry.${NC}"
        echo
        break
    elif [ "$claude_exit" -ne 0 ]; then
        failed_count=$((failed_count + 1))
        echo -e "  ${RED}Failed: $exit_reason (${duration}s)${NC}"
    else
        ok_count=$((ok_count + 1))
        echo -e "  ${GREEN}OK (${duration}s)${NC}"
    fi

    # Run analysis (best-effort)
    echo -e "  Analyzing results..."
    "$EXPERIMENTS_DIR/analyze-run.sh" "$run_dir" >/dev/null 2>&1 || \
        echo -e "  ${YELLOW}Analysis failed; run dir preserved.${NC}"

    echo

    # Brief pause between runs
    sleep 5
done

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Batch Complete${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "  Planned: $total"
echo -e "  ${GREEN}OK:${NC}           $ok_count"
echo -e "  ${RED}Failed:${NC}       $failed_count"
echo -e "  ${RED}Rate-limited:${NC} $ratelimited_count"
echo -e "\n${YELLOW}Results saved to: $RUNS_DIR${NC}"
