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
# Default 7200s (2h). This is the methodological budget — runs that
# hit it are not data errors but legitimate "did not complete within
# practical budget" findings (see top-level README.md → "Timeouts as a
# research finding"). Do NOT lower this without coordinating across the
# RQ data set: shorter budgets re-classify previously OK runs as
# timeouts and break cross-batch comparability.
# Raised from 5400s (90 min) on 2026-05-21: v4.1/v4.2/v6 workflows
# are slower on novel katas and need more headroom.
CLAUDE_TIMEOUT_SECONDS="${CLAUDE_TIMEOUT_SECONDS:-7200}"

# Rate-limit / API-overload / subscription-quota behaviour. Tunable via env.
#   BATCH_RATELIMIT_RETRIES   per-run retries on rate-limit/overload/quota
#                             (default 5). Staged backoff: 60s, 5min, 30min,
#                             1h, 2h (≈ 3.7h total). Covers both transient
#                             API errors (529, terminated) and Anthropic
#                             subscription-quota resets ("hit your limit").
#   BATCH_CONSECUTIVE_GIVEUP  consecutive runs that exhausted retries before
#                             aborting the whole batch (default 10).
BATCH_RATELIMIT_RETRIES="${BATCH_RATELIMIT_RETRIES:-5}"
BATCH_CONSECUTIVE_GIVEUP="${BATCH_CONSECUTIVE_GIVEUP:-10}"

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
    # opus-4-8 and fable-5 are not yet on Portkey/Vertex — they run via the
    # native Anthropic API. Launch their batches with the ANTHROPIC_BASE_URL/
    # AUTH_TOKEN/CUSTOM_HEADERS env vars blanked so the .env Portkey routing is
    # bypassed and the CLI falls back to ~/.claude/.credentials.json (native
    # OAuth). Neither has a -portkey variant for the same reason.
    "opus-4-8|claude-opus-4-8|true"
    "opus-4-8-no-thinking|claude-opus-4-8|false"
    "fable-5|claude-fable-5|true"
    "fable-5-no-thinking|claude-fable-5|false"
    "opus-4-7|claude-opus-4-7|true"
    "opus-4-7-no-thinking|claude-opus-4-7|false"
    "sonnet-4-6|claude-sonnet-4-6|true"
    "sonnet-4-6-no-thinking|claude-sonnet-4-6|false"
    "haiku-4-5|claude-haiku-4-5-20251001|true"
    "haiku-4-5-no-thinking|claude-haiku-4-5-20251001|false"
    # Portkey routing for opus-4-6: requires ANTHROPIC_BASE_URL +
    # ANTHROPIC_CUSTOM_HEADERS (see .env.example). The -portkey suffix
    # labels runs that were routed via Portkey, so they remain
    # distinguishable from any future direct-API opus-4-6 runs.
    "opus-4-7-portkey|@vertex-eu-global/anthropic.claude-opus-4-7|true"
    "opus-4-7-portkey-no-thinking|@vertex-eu-global/anthropic.claude-opus-4-7|false"
    "opus-4-6-portkey|@vertex-ai/anthropic.claude-opus-4-6|true"
    "opus-4-6-portkey-no-thinking|@vertex-ai/anthropic.claude-opus-4-6|false"
    "sonnet-4-6-portkey|@vertex-ai/anthropic.claude-sonnet-4-6|true"
    "sonnet-4-6-portkey-no-thinking|@vertex-ai/anthropic.claude-sonnet-4-6|false"
    "haiku-4-5-portkey|@vertex-ai/anthropic.claude-haiku-4-5@20251001|true"
    "haiku-4-5-portkey-no-thinking|@vertex-ai/anthropic.claude-haiku-4-5@20251001|false"
    # OpenCode-only models — cli_model is a placeholder; the actual --model
    # string is resolved in the OC invocation branch via the case-mapping
    # below (uses portkey/<provider>/<model> format that opencode.json
    # registers). thinking=false because OC has no thinking-token flag.
    "kimi-k2-6|oc-only|false"
    "minimax-m2-7|oc-only|false"
    "gemini-2-5-pro|oc-only|false"
    "gemini-3-5-flash|oc-only|false"
    "glm-5-1|oc-only|false"
    "deepseek-v4-flash|oc-only|false"
    "deepseek-v4-pro|oc-only|false"
    "mistral-medium-3-5|oc-only|false"
    "devstral-medium-2507|oc-only|false"
    "devstral-2512|oc-only|false"
    "codestral-2508|oc-only|false"
    "qwen3-coder-480b|oc-only|false"
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
echo -e "${BLUE}Rate-limit retries:${NC} ${BATCH_RATELIMIT_RETRIES} per run, abort after ${BATCH_CONSECUTIVE_GIVEUP} consecutive failures"
echo

# ---------------------------------------------------------------------------
# save_transcript: copy Claude session JSONL + subagent transcripts into
# the run dir so analyze-run.sh / analyze_transcript.py can pick them up.
# Ported from experiments/record-run.sh:401-445.
# ---------------------------------------------------------------------------
save_transcript() {
    local run_dir=$1

    # Claude Code stores session JSONLs under
    # ~/.claude/projects/<dashed-path>/<uuid>.jsonl, where dashed-path is
    # the absolute run dir with every non-alphanumeric char replaced by "-".
    local dashed_path
    dashed_path=$(echo "$run_dir" | sed 's|[^a-zA-Z0-9]|-|g')
    local home_dir="${HOME:-/home/experimenter}"
    local project_dir="$home_dir/.claude/projects/$dashed_path"

    if [ ! -d "$project_dir" ]; then
        echo -e "  ${YELLOW}Transcript project dir not found: $project_dir${NC}"
        return
    fi

    # Pick the most recently modified <uuid>.jsonl as the main session.
    local newest_jsonl
    newest_jsonl=$(ls -t "$project_dir"/*.jsonl 2>/dev/null | head -1)

    if [ -z "$newest_jsonl" ] || [ ! -f "$newest_jsonl" ]; then
        echo -e "  ${YELLOW}No transcript JSONL found in $project_dir${NC}"
        return
    fi

    cp "$newest_jsonl" "$run_dir/transcript.jsonl"

    # Subagent transcripts (v4) live under <project_dir>/<uuid>/subagents/.
    local session_uuid
    session_uuid=$(basename "$newest_jsonl" .jsonl)
    local subagent_src="$project_dir/$session_uuid/subagents"
    if [ -d "$subagent_src" ]; then
        local count
        count=$(ls -1 "$subagent_src"/agent-*.jsonl 2>/dev/null | wc -l | tr -d '[:space:]')
        if [ "$count" -gt 0 ]; then
            mkdir -p "$run_dir/transcript-subagents"
            cp "$subagent_src"/agent-*.jsonl "$run_dir/transcript-subagents/"
            # Meta files carry agentType used by analyze_transcript.py to
            # identify red-phase agents for prediction counts.
            cp "$subagent_src"/agent-*.meta.json "$run_dir/transcript-subagents/" 2>/dev/null || true
        fi
    fi
}

# ---------------------------------------------------------------------------
# Run loop
# ---------------------------------------------------------------------------

current=0
ok_count=0
failed_count=0
ratelimited_count=0
consecutive_ratelimited=0

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
    # Avoid collision when parallel shards start the same cell in the same second.
    if [ -d "$run_dir" ]; then
        suffix=2
        while [ -d "${run_dir}-${suffix}" ]; do
            suffix=$((suffix + 1))
        done
        run_dir="${run_dir}-${suffix}"
    fi
    mkdir -p "$run_dir/src"

    # Detect harness from workflow definition. .pi/ marks a pi workflow,
    # .opencode/ an OpenCode workflow, .claude/ a Claude Code workflow.
    # The marker dir is also the source of harness-specific config.
    if [ -d "$WORKFLOWS_DIR/$workflow/.pi" ]; then
        harness=pi
    elif [ -d "$WORKFLOWS_DIR/$workflow/.opencode" ]; then
        harness=opencode
    elif [ -d "$WORKFLOWS_DIR/$workflow/.claude" ]; then
        harness=claude
    else
        echo -e "  ${RED}ERROR: workflow $workflow has neither .claude/, .opencode/, nor .pi/${NC}"
        failed_count=$((failed_count + 1))
        continue
    fi

    # Copy workflow config
    if [ "$harness" = "claude" ]; then
        cp -r "$WORKFLOWS_DIR/$workflow/.claude" "$run_dir/"
    elif [ "$harness" = "opencode" ]; then
        # Mirror the marker dir AND promote opencode.json / AGENTS.md to
        # run_dir root, because OpenCode reads those from cwd, not from
        # .opencode/.
        cp -r "$WORKFLOWS_DIR/$workflow/.opencode" "$run_dir/"
        [ -f "$WORKFLOWS_DIR/$workflow/.opencode/opencode.json" ] && \
            cp "$WORKFLOWS_DIR/$workflow/.opencode/opencode.json" "$run_dir/"
        [ -f "$WORKFLOWS_DIR/$workflow/.opencode/AGENTS.md" ] && \
            cp "$WORKFLOWS_DIR/$workflow/.opencode/AGENTS.md" "$run_dir/"
    elif [ "$harness" = "pi" ]; then
        # Mirror .pi/ into run_dir. pi reads AGENTS.md via cwd walk-up.
        # Project-local skills (.pi/skills/) and agents (.pi/agents/) are
        # discovered by pi + the subagent extension from cwd walk-up.
        # Provider config (models.json) and the subagent extension itself
        # come from the global /home/experimenter/.pi/agent/ bind-mount.
        cp -r "$WORKFLOWS_DIR/$workflow/.pi" "$run_dir/"
        [ -f "$WORKFLOWS_DIR/$workflow/.pi/AGENTS.md" ] && \
            cp "$WORKFLOWS_DIR/$workflow/.pi/AGENTS.md" "$run_dir/"
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
    "tsx": "^4.7.0",
    "vitest": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0",
    "eslint": "^9.0.0",
    "eslint-plugin-sonarjs": "^1.0.0",
    "typescript-eslint": "^8.0.0"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["esbuild"]
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

    # Record start
    cat > "$run_dir/metrics.json" << EOF
{
  "kata": "$kata",
  "workflow": "$workflow",
  "model": "$model_name",
  "cli_model": "$cli_model",
  "thinking": $thinking,
  "started_at": "$(date -Iseconds)",
  "ended_at": null,
  "duration_seconds": null,
  "batch_run": true,
  "plan_file": $( [ -n "$PLAN_FILE" ] && echo "\"$PLAN_FILE\"" || echo "null" )
}
EOF

    # Install dependencies (--prefer-offline reuses the persistent store
    # volume; falls back to network only for genuinely missing packages)
    echo -e "  Installing dependencies..."
    (cd "$run_dir" && pnpm install --silent --prefer-offline 2>/dev/null) || true

    # Run Claude Code with timeout + capture log + tolerate non-zero exit.
    echo -e "  Running Claude Code... (model: $cli_model, thinking: $thinking)"
    start_time=$(date +%s)
    run_log="$run_dir/run.log"
    claude_exit=0
    rate_limited="false"
    transient_api_error="false"
    retry_attempts=0
    transient_reason=""

    # Retry loop: repeats only on rate-limit/overload OR a transient
    # Anthropic-side API failure (e.g. "API Error: terminated", connection
    # reset). Other outcomes — success, timeout, or a generic error that
    # does not match the transient signatures — leave the loop immediately.
    # Backoff doubles from 60s. The loop reuses the same run_dir and
    # run_log; the log is overwritten on each attempt.
    for attempt in $(seq 0 "$BATCH_RATELIMIT_RETRIES"); do
        if [ "$attempt" -gt 0 ]; then
            # Staged backoff: short for API hiccups, long for quota resets.
            # Subscription-quota windows ("hit your limit") typically reset
            # at the next hour boundary, so the schedule jumps from 5min to
            # 30min after the second attempt.
            case "$attempt" in
                1) backoff=60   ;;
                2) backoff=300  ;;
                3) backoff=1800 ;;
                4) backoff=3600 ;;
                *) backoff=7200 ;;
            esac
            echo -e "  ${YELLOW}${transient_reason} detected; retry $attempt/$BATCH_RATELIMIT_RETRIES after ${backoff}s backoff...${NC}"
            sleep "$backoff"
            : > "$run_log"
        fi

        set +e
        if [ "$harness" = "pi" ]; then
            # Lab-variant model name → pi --model format. Walking skeleton:
            # only Opus 4.7 via Portkey-Vertex-EU wired. Same upstream as OC.
            # pi's models.json (per-workflow copy in $run_dir/.pi/) defines
            # provider=portkey with api:"openai-completions" and the
            # x-portkey-api-key header, so PORTKEY_API_KEY in the env is
            # sufficient for auth.
            case "$model_name" in
                opus-4-7-portkey)              pi_model="portkey/@vertex-eu-global/anthropic.claude-opus-4-7" ;;
                opus-4-7-portkey-no-thinking)  pi_model="portkey/@vertex-eu-global/anthropic.claude-opus-4-7" ;;
                *) echo -e "  ${RED}ERROR: no pi model mapping for $model_name${NC}"
                   claude_exit=2
                   pi_model="" ;;
            esac
            if [ -n "$pi_model" ]; then
                # Provider (Portkey) + subagent extension live in
                # /home/experimenter/.pi/agent/ (bind-mounted from
                # experiments/docker/pi-config/). Project-level skills and
                # agents live in $run_dir/.pi/ and are discovered via the
                # subagent extension's cwd walk-up. --mode json writes the
                # full event-stream JSONL to stdout — redirect to $run_log
                # only (no tee) so it doesn't flood the batch shard log.
                (cd "$run_dir" && \
                    timeout --signal=TERM --kill-after=30s "$CLAUDE_TIMEOUT_SECONDS" \
                    pi -p --mode json --no-session --model "$pi_model" \
                    "Read prompt.md and complete the exercise following the workflow rules. Continue autonomously through ALL tests in the test list until you have written experiment-done.txt with the single word DONE. Do NOT stop after a single passing test or cycle — keep going until every test is implemented.") \
                    > "$run_log" 2>&1
                claude_exit=$?
            fi
        elif [ "$harness" = "opencode" ]; then
            # Lab-variant model name → OpenCode --model format. Skeleton
            # uses hardcoded mapping; generalize when more OC models land.
            case "$model_name" in
                # Provider = "portkey" (single OC provider block); model id
                # carries the @<integration>/<upstream-id> prefix that
                # Portkey uses to dispatch to the right backend integration
                # (@vertex-*, @openrouter-eval, etc.). Matches the user's
                # local ~/.config/opencode/opencode.jsonc convention.
                opus-4-7-portkey)  oc_model="portkey/@vertex-eu-global/anthropic.claude-opus-4-7" ;;
                # OC has no thinking-token flag — `opus-4-7-portkey-no-thinking`
                # routes to the same upstream model as `opus-4-7-portkey`. The
                # no-thinking suffix preserves the cross-harness RQ-controls
                # convention (controls.model identifies the CC-side variant;
                # OC matches it because thinking is structurally off there).
                opus-4-7-portkey-no-thinking)  oc_model="portkey/@vertex-eu-global/anthropic.claude-opus-4-7" ;;
                gemini-2-5-pro)    oc_model="portkey/@vertex-ai/gemini-2.5-pro" ;;
                gemini-3-5-flash)  oc_model="portkey/@vertex-eu-global/gemini-3.5-flash" ;;
                kimi-k2-6)         oc_model="portkey/@openrouter-eval/moonshotai/kimi-k2.6" ;;
                minimax-m2-7)      oc_model="portkey/@openrouter-eval/minimax/minimax-m2.7" ;;
                glm-5-1)           oc_model="portkey/@openrouter-eval/z-ai/glm-5.1" ;;
                deepseek-v4-flash) oc_model="portkey/@openrouter-eval/deepseek/deepseek-v4-flash" ;;
                deepseek-v4-pro)   oc_model="portkey/@openrouter-eval/deepseek/deepseek-v4-pro" ;;
                mistral-medium-3-5)   oc_model="portkey-mistral/@mistral/mistral-medium-3-5" ;;
                devstral-medium-2507) oc_model="portkey-cc/@mistral/devstral-medium-2507" ;;
                devstral-2512)        oc_model="portkey-cc/@mistral/devstral-2512" ;;
                codestral-2508)       oc_model="portkey-cc/@mistral/codestral-2508" ;;
                qwen3-coder-480b)     oc_model="portkey-cc/@bedrock-eu-north-1/qwen.qwen3-coder-480b-a35b-v1:0" ;;
                *) echo -e "  ${RED}ERROR: no OpenCode model mapping for $model_name${NC}"
                   claude_exit=2
                   oc_model="" ;;
            esac
            if [ -n "$oc_model" ]; then
                # Continuation pressure: some models (Gemini 2.5 Pro
                # observed 2026-05-25) interpret a passing test run as a
                # natural conversation endpoint and stop autonomously
                # without finishing the test list. Explicit "continue until
                # experiment-done.txt" keeps them in the loop.
                # opencode run streams verbose tool/event output; keep it
                # in $run_log only to avoid flooding the batch shard log.
                (cd "$run_dir" && timeout --signal=TERM --kill-after=30s "$CLAUDE_TIMEOUT_SECONDS" \
                    opencode run --model "$oc_model" --dangerously-skip-permissions \
                    "Read prompt.md and complete the exercise following the workflow rules. Continue autonomously through ALL tests in the test list until you have written experiment-done.txt with the single word DONE. Do NOT stop after a single passing test or cycle — keep going until every test is implemented.") \
                    > "$run_log" 2>&1
                claude_exit=$?
            fi
        elif [ "$thinking" = "false" ]; then
            (cd "$run_dir" && MAX_THINKING_TOKENS=0 timeout --signal=TERM --kill-after=30s "$CLAUDE_TIMEOUT_SECONDS" \
                claude --dangerously-skip-permissions --strict-mcp-config --model "$cli_model" --print \
                "Read prompt.md and complete the exercise following the workflow rules.") \
                2>&1 | tee "$run_log"
            claude_exit=${PIPESTATUS[0]}
        else
            (cd "$run_dir" && timeout --signal=TERM --kill-after=30s "$CLAUDE_TIMEOUT_SECONDS" \
                claude --dangerously-skip-permissions --strict-mcp-config --model "$cli_model" --print \
                "Read prompt.md and complete the exercise following the workflow rules.") \
                2>&1 | tee "$run_log"
            claude_exit=${PIPESTATUS[0]}
        fi
        set -e

        # Classify the failure. We treat a run as transient on the usual
        # exit!=0 signatures (rate-limit, overload, connection drop) AND
        # on two exit=0 patterns that look successful but aren't:
        #   - "Waiting for retry window to clear." as the *only* CLI
        #     output: the Anthropic CLI swallowed a subscription-cap and
        #     gracefully exited 0 with a half-done TDD loop.
        #   - empty/near-empty run.log: external session cut where the
        #     CLI shut down without printing its usual final summary.
        # Both produce exit=0 but no useful final-text line; without
        # explicit detection they are scored as "ok" by downstream
        # analysis. Run.log is checked BEFORE the cli.ts nudge runs (the
        # nudge appends via `tee -a` and would otherwise mask the empty
        # log).
        # Pattern uses word-boundaries on numeric codes so paths
        # containing digits like ".../backup.1777786429234.json" do not
        # falsely trigger.
        rate_limited="false"
        transient_api_error="false"
        transient_reason=""
        if [ "$claude_exit" -ne 0 ]; then
            # "hit your limit" / "resets <time>" is the Anthropic
            # subscription-quota signature shown by the Claude CLI when
            # the daily/weekly cap is reached (different from API
            # 429/529). Treated as rate-limit so the retry/backoff path
            # waits it out instead of failing the batch.
            if grep -qiE "rate.?limit|\b429\b|\b529\b|usage limit|overloaded|hit your limit|resets [0-9]+(:[0-9]+)?\s*[ap]m" "$run_log" 2>/dev/null; then
                rate_limited="true"
                transient_reason="Rate-limit"
            # "API Error: terminated" is the Anthropic CLI's signature for
            # an upstream connection drop. ECONN/EAI/socket errors are the
            # underlying network-stack equivalents. None of these come
            # from model output, so substring matching is safe.
            elif grep -qiE "API Error: terminated|API Error: Connection error|ECONNRESET|ECONNREFUSED|EAI_AGAIN|socket hang up" "$run_log" 2>/dev/null; then
                transient_api_error="true"
                transient_reason="Transient API error"
            fi
        else
            # Exit-0 cap signatures. Only checked for Claude harness — pi
            # and OpenCode have their own end-of-session conventions.
            if [ "$harness" = "claude" ]; then
                # Trimmed log content (whitespace stripped). On a healthy
                # run this is the model's final report (tests passed, done
                # marker written, etc.). On a capped run this is exactly
                # the CLI's stoic one-liner, or empty.
                log_content=$(tr -d '[:space:]' < "$run_log" 2>/dev/null | head -c 200)
                if grep -qiE "Waiting for retry window to clear" "$run_log" 2>/dev/null; then
                    rate_limited="true"
                    transient_reason="Subscription-cap (graceful exit)"
                elif [ -z "$log_content" ]; then
                    # Empty log + exit 0 = external session cut. The CLI
                    # left without saying anything; the model session
                    # transcript will show stop_reason=tool_use on the
                    # last assistant message. Treat as transient so the
                    # backoff path retries instead of marking it ok.
                    transient_api_error="true"
                    transient_reason="External session cut (empty log)"
                fi
            fi
        fi

        # Leave the loop unless we hit a known transient signature.
        # Non-matching failures (timeout, real bugs) and successes both
        # exit immediately — only transient API issues warrant a retry.
        if [ "$rate_limited" = "false" ] && [ "$transient_api_error" = "false" ]; then
            break
        fi
        retry_attempts=$attempt
    done

    # Save main transcript BEFORE the optional nudge below. The nudge
    # spawns a second `claude --print` invocation that creates a new
    # session jsonl; if save_transcript runs after the nudge, `ls -t`
    # picks the nudge jsonl and overwrites the main TDD-loop transcript.
    # All cycle_count / refactorings / predictions then drop to 0 for
    # the affected runs (typical for outlier runs that finish without
    # cli.ts and trigger the nudge).
    # OpenCode runs don't produce ~/.claude/projects/ transcripts —
    # they have their own session DB; export it instead.
    if [ "$harness" = "opencode" ]; then
        # Sessions live in the container's SQLite DB (lost on --rm), so
        # export the just-completed one synchronously. Most-recent session
        # = the one this run just created (single OC invocation per run).
        oc_session_id=$( (cd "$run_dir" && opencode session list -n 1 --format json 2>/dev/null) | jq -r '.[0].id // empty' )
        if [ -n "$oc_session_id" ]; then
            (cd "$run_dir" && opencode export "$oc_session_id" > "$run_dir/transcript-opencode.json" 2>/dev/null) || \
                echo -e "  ${YELLOW}opencode export $oc_session_id failed${NC}"
        else
            echo -e "  ${YELLOW}No OpenCode session found to export${NC}"
        fi
    elif [ "$harness" = "pi" ]; then
        # pi --mode json writes the event stream to stdout; tee already
        # mirrored it to $run_log. Extract pure NDJSON lines (filter out
        # non-JSON noise like the cli.ts nudge follow-ups) into transcript-pi.jsonl.
        if [ -f "$run_log" ]; then
            grep -E '^\{"type":' "$run_log" > "$run_dir/transcript-pi.jsonl" 2>/dev/null || true
        fi
    else
        save_transcript "$run_dir"
    fi

    # --- cli.ts nudge ---------------------------------------------------
    # If the agent finished successfully but forgot to create src/cli.ts,
    # nudge it once with a short follow-up prompt. This fixes a recurring
    # measurement artefact where verification scores 0/15 because the
    # entry point is missing, not because the domain logic is wrong.
    # Skeleton: OC nudge not wired yet — relying on AGENTS.md to instruct
    # cli.ts creation directly. Revisit if claim-office cells trip the gap.
    if [ "$harness" = "claude" ] && [ "$claude_exit" -eq 0 ] \
            && [ "$rate_limited" = "false" ] && [ "$transient_api_error" = "false" ] \
            && [ ! -f "$run_dir/src/cli.ts" ] && [ -f "$run_dir/src/claim-office.ts" ]; then
        echo -e "  ${YELLOW}src/cli.ts missing — nudging agent to create it...${NC}"
        set +e
        if [ "$thinking" = "false" ]; then
            (cd "$run_dir" && MAX_THINKING_TOKENS=0 timeout --signal=TERM --kill-after=30s 120 \
                claude --dangerously-skip-permissions --strict-mcp-config --model "$cli_model" --print \
                "The file src/cli.ts is missing. The prompt requires a CLI entry point at src/cli.ts that reads JSON from stdin and writes JSON to stdout. Create src/cli.ts now. It should import from your existing module and wire up stdin reading, processing, and stdout output.") \
                2>&1 | tee -a "$run_log"
        else
            (cd "$run_dir" && timeout --signal=TERM --kill-after=30s 120 \
                claude --dangerously-skip-permissions --strict-mcp-config --model "$cli_model" --print \
                "The file src/cli.ts is missing. The prompt requires a CLI entry point at src/cli.ts that reads JSON from stdin and writes JSON to stdout. Create src/cli.ts now. It should import from your existing module and wire up stdin reading, processing, and stdout output.") \
                2>&1 | tee -a "$run_log"
        fi
        set -e
        if [ -f "$run_dir/src/cli.ts" ]; then
            echo -e "  ${GREEN}cli.ts created by nudge.${NC}"
        else
            echo -e "  ${RED}cli.ts still missing after nudge.${NC}"
        fi
    fi

    # Map exit code to a human-readable reason.
    case "$claude_exit" in
        0)   exit_reason="ok" ;;
        124) exit_reason="timeout" ;;
        137) exit_reason="timeout-killed" ;;
        *)   exit_reason="error-$claude_exit" ;;
    esac
    [ "$rate_limited" = "true" ]        && exit_reason="rate-limited"
    [ "$transient_api_error" = "true" ] && exit_reason="transient-api-error"
    # Backwards compat for downstream consumers that still reference
    # rate_limit_attempts in the old single-class retry log line.
    rate_limit_attempts=$retry_attempts

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

    # Tally. Both rate-limited and transient-api-error runs reach this
    # block only after the per-run retry budget was exhausted — they
    # are treated equivalently for the consecutive-failure circuit
    # breaker, because both signal a degraded upstream API rather than
    # a problem with the run itself. Abort the whole batch only after
    # $BATCH_CONSECUTIVE_GIVEUP runs in a row have all exhausted their
    # retries.
    if [ "$rate_limited" = "true" ] || [ "$transient_api_error" = "true" ]; then
        ratelimited_count=$((ratelimited_count + 1))
        consecutive_ratelimited=$((consecutive_ratelimited + 1))
        echo -e "  ${RED}${exit_reason} after $retry_attempts retries (${duration}s). Skipping analysis.${NC}"
        if [ "$consecutive_ratelimited" -ge "$BATCH_CONSECUTIVE_GIVEUP" ]; then
            echo -e "  ${RED}$consecutive_ratelimited consecutive transient failures — API appears down. Aborting.${NC}"
            echo -e "  ${YELLOW}Resume later by re-running ./batch.sh with the same plan file.${NC}"
            echo
            break
        fi
        echo -e "  ${YELLOW}Continuing with next run (consecutive transient failures: $consecutive_ratelimited/$BATCH_CONSECUTIVE_GIVEUP).${NC}"
    elif [ "$claude_exit" -ne 0 ]; then
        failed_count=$((failed_count + 1))
        consecutive_ratelimited=0
        echo -e "  ${RED}Failed: $exit_reason (${duration}s)${NC}"
    else
        ok_count=$((ok_count + 1))
        consecutive_ratelimited=0
        echo -e "  ${GREEN}OK (${duration}s)${NC}"
    fi

    # (transcript already saved above, before the optional cli.ts nudge)

    # Run analysis (best-effort)
    echo -e "  Analyzing results..."
    # Capture stderr to <run_dir>/analyze.err so post-mortem is possible
    # without spamming batch.log. Stdout stays suppressed because
    # analyze-run.sh prints its own banner/progress that we don't need.
    "$EXPERIMENTS_DIR/analyze-run.sh" "$run_dir" >/dev/null 2>"$run_dir/analyze.err" || \
        echo -e "  ${YELLOW}Analysis failed; run dir preserved (see analyze.err).${NC}"
    # Drop empty error log to keep run dirs tidy.
    [ -s "$run_dir/analyze.err" ] || rm -f "$run_dir/analyze.err"

    # Truncate run.log to last 500 lines once analysis succeeded.
    # pi/oc harnesses tee full NDJSON event streams here, which can balloon
    # past GitHub's 50 MB file-size warning on long sessions. The tail
    # preserves the final test summary and agent-side completion signal,
    # which is all spot-checks need.
    if [ -f "$run_dir/run.log" ] && [ ! -f "$run_dir/analyze.err" ]; then
        log_size=$(stat -c%s "$run_dir/run.log" 2>/dev/null || echo 0)
        if [ "$log_size" -gt 1048576 ]; then
            tail -n 500 "$run_dir/run.log" > "$run_dir/run.log.tail" && \
                mv "$run_dir/run.log.tail" "$run_dir/run.log"
        fi
    fi

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
