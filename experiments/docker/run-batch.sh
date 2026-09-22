#!/bin/bash

# Batch Experiment Runner
# Runs experiments either as a full cross-product (default) or from an
# explicit JSON plan file passed via --plan.

set -e

EXPERIMENTS_DIR="/home/experimenter/experiments"
KATAS_DIR="$EXPERIMENTS_DIR/katas"
STACKS_DIR="$EXPERIMENTS_DIR/stacks"
WORKFLOWS_DIR="$EXPERIMENTS_DIR/workflows"
WORKFLOW_PATHS_FILE="$WORKFLOWS_DIR/PATHS.json"
WORKFLOW_ALIASES_FILE="$WORKFLOWS_DIR/ALIASES.json"

# Workflows liegen seit dem Lineage-Umbau in Kategorie-Unterordnern
# (exact-coding/opus/, baselines/, external/, _archive/...), der Plan nennt aber
# weiterhin nur den Leaf-Namen -- er muss slash-frei bleiben, weil er direkt in
# den Run-Ordnernamen wandert. Aufgeloest wird deshalb ueber PATHS.json, das
# workflow-lineage.py aus LINEAGE.yaml generiert. Kein Verzeichnis-Suchlauf:
# so ist ein Tippfehler ein Fehler und kein Zufallstreffer.
wf_canonical() {
    local name="$1"
    [ -f "$WORKFLOW_ALIASES_FILE" ] || { echo "$name"; return; }
    jq -r --arg n "$name" '.[$n] // $n' "$WORKFLOW_ALIASES_FILE"
}

wf_path() {
    local rel
    rel=$(jq -r --arg n "$(wf_canonical "$1")" '.[$n] // empty' "$WORKFLOW_PATHS_FILE" 2>/dev/null)
    [ -n "$rel" ] && echo "$WORKFLOWS_DIR/$rel" || echo "$WORKFLOWS_DIR/$1"
}

wf_list() {
    # Archiv am PFAD filtern, nicht am Namen: verworfene Workflows heissen
    # exact-hybrid-v4.1-refactor-vocab-cc, liegen aber unter _archive/. Das
    # alte list_enabled sprang ueber das Verzeichnis _archive -- dieselbe
    # Semantik, nur eine Ebene tiefer.
    jq -r 'to_entries[] | select(.value | startswith("_") | not) | .key' \
        "$WORKFLOW_PATHS_FILE" 2>/dev/null || true
}
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
    # Native Anthropic models: cli_model is a bare `claude-*` ID (no vertex/,
    # no @-provider, no -requesty/-portkey label). These are auto-detected as
    # native by the CC-invocation branches below (case "$cli_model" in claude-*)
    # and run with the container's Requesty env (ANTHROPIC_BASE_URL/AUTH_TOKEN/
    # CUSTOM_HEADERS/DEFAULT_*_MODEL) blanked, so the CLI falls back to the
    # mounted ~/.claude/.credentials.json (native OAuth) and hits the native
    # Anthropic API at list price. Without the bypass the native alias would be
    # sent to the Requesty route and 403 (see the opus-4-8-requesty note below).
    "opus-5|claude-opus-5|true"
    "opus-5-no-thinking|claude-opus-5|false"
    "opus-4-8|claude-opus-4-8|true"
    "opus-4-8-no-thinking|claude-opus-4-8|false"
    # opus-4-8 via Requesty (Anthropic /v1/messages path). cli_model carries
    # the Requesty route format (native alias claude-opus-4-8 → 403); CC picks
    # it up via --model. Requires .env ANTHROPIC_BASE_URL=router.eu.requesty.ai
    # + ANTHROPIC_AUTH_TOKEN=$REQUESTY_API_KEY. The -requesty suffix keeps these
    # runs distinguishable from native opus-4-8 (different tariff, real cost).
    "opus-4-8-requesty|vertex/claude-opus-4-8@eu|true"
    "opus-4-8-requesty-no-thinking|vertex/claude-opus-4-8@eu|false"
    "fable-5|claude-fable-5|true"
    "fable-5-no-thinking|claude-fable-5|false"
    # fable-5-1: nativ wie fable-5 (bare claude-* → OAuth-Bypass, Subscription).
    # Nur der undatierte Alias existiert; claude-fable-5-1-<datum> gibt 404.
    "fable-5-1|claude-fable-5-1|true"
    "fable-5-1-no-thinking|claude-fable-5-1|false"
    # sonnet-5-native: nativ wie opus-5/fable-5 (bare claude-* -> OAuth-Bypass,
    # Subscription). Der blanke Name `sonnet-5` ist NICHT frei -- er gehoert der
    # pi/Requesty-Route (vertex/claude-sonnet-5@eu) weiter unten, und 15 Runs
    # plus zwei pi-RQs und zwei eingefrorene Reports tragen ihn bereits. Daher
    # traegt hier die native Route das Suffix, umgekehrt zur opus-5-Aufteilung.
    # Andere Route, anderer Tarif -- die beiden Zellen nie zusammenfassen.
    "sonnet-5-native|claude-sonnet-5|true"
    "sonnet-5-native-no-thinking|claude-sonnet-5|false"
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
    # pi-harness-only models (Requesty-routed) — cli_model is a placeholder;
    # the actual --model string is resolved in the pi invocation branch via
    # the pi_model case-mapping below (requesty/<provider>/<model> format).
    # These must be registered here so plan validation (lookup_model_config)
    # accepts them; harness (pi/oc/claude) is chosen from the workflow marker
    # dir, not from the model, so a pi-only placeholder is sufficient.
    # opus-4-8, glm-5-1 and deepseek-v4-pro already appear above (native /
    # oc-only entries) and are reused by the pi branch, so they are not
    # repeated here.
    "sonnet-5|pi-only|false"
    # opus-5 via Requesty (vertex/claude-opus-5@eu), usable by both Claude Code
    # and pi. Claude Code passes this route through --model; pi resolves the
    # same lab id in its own case-map below. The bare `opus-5` id is already
    # taken by the native Direct-API route, so this arm carries the -requesty
    # suffix. Different route and tariff: never merge the two cells.
    "opus-5-requesty|vertex/claude-opus-5@eu|false"
    # gpt-5-6-sol is wired for BOTH pi and OpenCode (same Requesty route,
    # azure/gpt-5.6-sol@swedencentral). The `pi-only` placeholder here only
    # feeds plan validation, which just checks the name exists — the harness
    # is chosen from the workflow marker dir, and each harness branch resolves
    # its own model string. Do not read the placeholder as "pi only".
    "gpt-5-6-sol|pi-only|false"
    # Same underlying model as gpt-5-6-sol, different route: the OpenAI
    # subscription (provider openai-codex, api openai-codex-responses,
    # chatgpt.com/backend-api) instead of Requesty/Azure. Separate id because
    # the route is always explicit in the id -- different tariff (subscription
    # vs. per-token), different auth (OAuth in pi-config/agent/auth.json vs.
    # REQUESTY_API_KEY), and the codex entry reports reasoning:true where the
    # Requesty one is wired reasoning:false. Do not merge the two into one cell.
    "gpt-5-6-sol-codex|pi-only|false"
    # Same subscription route (provider openai-codex), different model:
    # GPT-5.3 Codex Spark. Not offered on Requesty, so the codex route is the
    # only one -- the `-codex` suffix still names it explicitly, per the
    # route-in-the-id convention above. Costs are not modelled: the
    # subscription is flat-rate, and copying the per-token Sol prices would
    # fabricate a number.
    "gpt-5-3-codex-spark|pi-only|false"
    # Same subscription route (provider openai-codex), third model: GPT-6
    # Astra. Like Spark it is not offered on Requesty, so the codex route is
    # the only one -- the `-codex` suffix names it explicitly per the
    # route-in-the-id convention above (the upstream id `gpt-6-astra` carries
    # no route hint of its own, unlike `gpt-5.3-codex-spark`). Costs are not
    # modelled: flat-rate subscription, and the models.json entry ships
    # without a `cost` block for that reason.
    "gpt-6-astra-codex|pi-only|false"
    # Same subscription route (provider openai-codex), fourth model: GPT-6
    # Sol, successor of gpt-5-6-sol. Codex route only for now; the `-codex`
    # suffix keeps the route explicit, so a later Requesty id can sit next
    # to it without merging cells. Reasoning is a property of the codex
    # route (see the 2x2 block below), so there is no -no-thinking arm.
    "gpt-6-sol-codex|pi-only|false"
    "gpt-5-6-terra|pi-only|false"
    "glm-5-2|pi-only|false"
    "kimi-k2-7|pi-only|false"
    "kimi-k3-nebius|pi-only|false"
    "kimi-k3-sference|pi-only|false"
    "minimax-m3|pi-only|false"
    "qwen3-235b|pi-only|false"
    # Reasoning-off arm (RQ-model-novel-pi fair baseline). Same routing as
    # the bare ids above; the pi branch strips the -no-thinking suffix and
    # adds `--thinking off`. Registered here only so plan validation accepts
    # them. opus-4-8-no-thinking already exists in the native block above.
    "sonnet-5-no-thinking|pi-only|false"
    "opus-5-requesty-no-thinking|vertex/claude-opus-5@eu|false"
    "gpt-5-6-sol-no-thinking|pi-only|false"
    "gpt-5-6-sol-codex-no-thinking|pi-only|false"
    "gpt-6-astra-codex-no-thinking|pi-only|false"
    # --- RQ-route-effect-pi 2x2 matrix: route x reasoning ---
    #
    # `--thinking off` does NOT suppress reasoning on the codex route: the
    # Responses API emits reasoning blocks regardless (~3000 per run), while
    # Chat Completions on requesty emits none. Reasoning is therefore not a
    # per-invocation flag here but a property of the models.json entry, and
    # that entry is container-global per model id.
    #
    # Hence one lab id per (route, reasoning) cell, each pinned to the
    # pi-config profile that declares it. The profile is NOT selectable per
    # run -- PI_CONFIG_DIR applies to the whole container -- so a plan must
    # not mix ids from different profiles. Same constraint class as the
    # container-global CC routing (see CLAUDE.md).
    #
    #   lab id                          profile              reasoning
    #   gpt-5-6-sol-no-thinking         pi-config            off (requesty declares false)
    #   gpt-5-6-sol-codex-no-thinking   pi-config            ON  (codex declares true)
    #   gpt-5-6-sol-reasoning           pi-config-reasoning  ON  (requesty flipped to true)
    #   gpt-5-6-sol-codex-noreason      pi-config-noreason   off (codex flipped to false)
    "gpt-5-6-sol-reasoning|pi-only|false"
    "gpt-5-6-sol-codex-noreason|pi-only|false"
    "gpt-5-6-terra-no-thinking|pi-only|false"
    "glm-5-1-no-thinking|pi-only|false"
    "glm-5-2-no-thinking|pi-only|false"
    "kimi-k2-7-no-thinking|pi-only|false"
    "kimi-k3-nebius-no-thinking|pi-only|false"
    "kimi-k3-sference-no-thinking|pi-only|false"
    "minimax-m3-no-thinking|pi-only|false"
    "deepseek-v4-pro-no-thinking|pi-only|false"
    "qwen3-235b-no-thinking|pi-only|false"
    # cursor-agent-harness-only models — cli_model is a placeholder; the actual
    # --model string is resolved in the cursor invocation branch via the
    # cursor_model case-mapping below. Registered here only so plan validation
    # (lookup_model_config) accepts them; harness is chosen from the workflow
    # marker dir (.cursor/), not from the model. Reasoning effort is encoded in
    # the cursor model id (-low/-medium/-high…), so thinking is always false.
    "opus-cursor|cursor-only|false"
    "composer-cursor|cursor-only|false"
    "grok-cursor|cursor-only|false"
    # auto-cursor: cursor's "Auto" router, the only model a free plan may use.
    # Not a pinned model -- usable for mechanics smoke runs only, never for
    # measurements (the routed model can change between runs).
    "auto-cursor|cursor-only|false"
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

# Every arm gets the same isolated repository so merely having Git available is
# not a TCR-arm confound. Runtime/analysis files are ignored: `git add -A` in a
# TCR skill must never commit metrics, transcripts, dependencies, or logs.
#
# The rules go into .git/info/exclude, not into a .gitignore file. A .gitignore
# in the run dir is also honoured by the *lab* repo, which then silently drops
# that run's metrics.json and transcripts from version control — 258 runs were
# recorded that way before this was found. info/exclude is repo-local, is not a
# file in the work tree, and disappears with the run repo.
init_run_git() {
    local run_dir="$1"
    git init --quiet "$run_dir" || {
        echo "Failed to create isolated Git repository in $run_dir" >&2
        return 1
    }
    cat > "$run_dir/.git/info/exclude" <<'EOF'
node_modules/
coverage/
dist/
metrics.json
metrics.tmp
run.log
analyze.err
transcript*.json*
transcript-subagents/
.claude_exit_*
.claude_rate_limited
verification.log
experiment-done.txt
tcr-commits.tsv
tcr-reflog.tsv
tcr-history.patch
tcr-final-status.txt
tcr-git-summary.json
EOF
    (
        cd "$run_dir"
        git config user.name "TCR Experiment"
        git config user.email "tcr-experiment@localhost"
        git add -A
        git commit --quiet -m "Initial kata state"
        [ "$(git rev-parse --show-toplevel)" = "$run_dir" ]
    ) || {
        echo "Failed to create isolated Git repository in $run_dir" >&2
        return 1
    }
}

# Preserve an auditable, reconstructable text history, then remove the nested
# repository so the outer lab repository can track the completed run normally.
export_run_git() {
    local run_dir="$1"
    [ -d "$run_dir/.git" ] || return 0
    (
        cd "$run_dir"
        [ "$(git rev-parse --show-toplevel)" = "$run_dir" ] || exit 1
        git status --porcelain=v1 > tcr-final-status.txt
        git log --reverse --format='%H%x09%aI%x09%s' > tcr-commits.tsv
        # git-gamble can amend a RED commit into GREEN; the reflog preserves
        # that phase transition even when the RED object leaves main history.
        # Reflog walking is newest-first; Git rejects --reverse with --walk-reflogs.
        git reflog --all --format='%H%x09%gD%x09%gs' > tcr-reflog.tsv
        git format-patch --stdout --root --no-signature > tcr-history.patch
        jq -n \
          --arg initial_commit "$(git rev-list --max-parents=0 HEAD | head -1)" \
          --arg final_commit "$(git rev-parse HEAD)" \
          --argjson commits_total "$(git rev-list --count HEAD)" \
          --argjson red_commits "$(git log --format=%s | grep -ci '^\[RED\]' || true)" \
          --argjson green_commits "$(git log --format=%s | grep -ci '^\[GREEN\]' || true)" \
          --argjson refactor_commits "$(git log --format=%s | grep -ci '^\[REFACTOR\]' || true)" \
          '{initial_commit: $initial_commit, final_commit: $final_commit,
            commits_total: $commits_total, method_commits: ($commits_total - 1),
            red_commits: $red_commits, green_commits: $green_commits,
            refactor_commits: $refactor_commits}' > tcr-git-summary.json
        jq --slurpfile tcr tcr-git-summary.json '.tcr = $tcr[0]' metrics.json \
          > metrics.tmp && mv metrics.tmp metrics.json
        rm -rf .git
    ) || {
        echo "Failed to export isolated Git repository in $run_dir" >&2
        return 1
    }
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

    # Pull entries; stack defaults to TypeScript for every historical plan.
    triple_count=$(jq '.runs | length' "$PLAN_FILE" 2>/dev/null || echo 0)
    if [ "$triple_count" = "null" ] || [ "$triple_count" = "0" ]; then
        echo -e "${RED}Plan file has no runs: $PLAN_FILE${NC}" >&2
        exit 3
    fi

    # --- Validation (fail-fast) ---
    errors=()
    while IFS=$'\t' read -r kata workflow model stack; do
        stack="${stack:-typescript-vitest}"
        if [ -z "$kata" ] || [ -z "$workflow" ] || [ -z "$model" ]; then
            errors+=("missing kata/workflow/model in entry: '$kata' '$workflow' '$model'")
            continue
        fi
        if [ ! -d "$KATAS_DIR/$kata" ]; then
            errors+=("unknown kata: '$kata'")
        fi
        # Alt-Namen zulassen, aber kanonisch weiterreichen: neue Runs tragen
        # damit immer den aktuellen Namen in Ordner und metrics.json.
        workflow=$(wf_canonical "$workflow")
        if [ ! -d "$(wf_path "$workflow")" ]; then
            errors+=("unknown workflow: '$workflow'")
        fi
        if ! lookup_model_config "$model" >/dev/null; then
            errors+=("unknown model: '$model'")
        fi
        # Every stack, TypeScript included, is now a directory with an
        # install.sh. No stack is exempt from the check any more.
        if [ ! -x "$STACKS_DIR/$stack/install.sh" ]; then
            errors+=("unknown stack: '$stack'")
        fi
        RUN_LIST+=("$kata|$workflow|$model|$stack")
    done < <(jq -r '.runs[] | [.kata, .workflow, .model, (.stack // "typescript-vitest")] | @tsv' "$PLAN_FILE")

    if [ ${#errors[@]} -gt 0 ]; then
        echo -e "${RED}Plan validation failed:${NC}" >&2
        for e in "${errors[@]}"; do
            echo -e "${RED}  - $e${NC}" >&2
        done
        echo
        echo -e "${YELLOW}Available katas:${NC}    $(list_enabled "$KATAS_DIR" | tr '\n' ' ')" >&2
        echo -e "${YELLOW}Available workflows:${NC} $(wf_list | tr '\n' ' ')" >&2
        echo -e "${YELLOW}Available models:${NC}   $(printf '%s ' "${MODEL_CONFIGS[@]}" | sed 's/|[^| ]*|[^ ]*//g')" >&2
        exit 3
    fi
else
    # Full cross-product mode
    mapfile -t katas < <(list_enabled "$KATAS_DIR")
    mapfile -t workflows < <(wf_list)

    for kata in "${katas[@]}"; do
        for workflow in "${workflows[@]}"; do
            for cfg in "${MODEL_CONFIGS[@]}"; do
                model_name=$(echo "$cfg" | cut -d'|' -f1)
                RUN_LIST+=("$kata|$workflow|$model_name|typescript-vitest")
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
    stack=$(echo "$entry" | cut -d'|' -f4)
    stack="${stack:-typescript-vitest}"
    cfg="$(lookup_model_config "$model_name")"
    cli_model=$(echo "$cfg" | cut -d'|' -f2)
    thinking=$(echo "$cfg" | cut -d'|' -f3)
    # Native Anthropic model? A bare claude-* cli_model routes to the native API
    # via OAuth credentials, so the container's Requesty env must be blanked on
    # the CC call (see MODEL_CONFIGS comment). vertex/…, @provider/…, and the
    # oc-only/pi-only placeholders are NOT native.
    case "$cli_model" in
        claude-*) native_cc=true ;;
        *)        native_cc=false ;;
    esac
    # env-prefix that blanks the container-global Requesty routing for native CC
    # runs so the CLI falls back to mounted native OAuth credentials. Empty for
    # non-native models (they keep the Requesty env from .env). Used as an array
    # so it expands to nothing when non-native.
    if [ "$native_cc" = true ]; then
        cc_env=(env -u ANTHROPIC_BASE_URL -u ANTHROPIC_AUTH_TOKEN -u ANTHROPIC_CUSTOM_HEADERS \
                    -u ANTHROPIC_DEFAULT_OPUS_MODEL -u ANTHROPIC_DEFAULT_SONNET_MODEL -u ANTHROPIC_DEFAULT_HAIKU_MODEL)
    else
        cc_env=()
    fi

    current=$((current + 1))
    echo -e "${YELLOW}[$current/$total] $kata + $workflow + $model_name + $stack${NC}"

    # Create run directory
    timestamp=$(date +%Y-%m-%d_%H-%M-%S)
    run_name="${timestamp}_${kata}_${workflow}_${model_name}"
    run_dir="$RUNS_DIR/$run_name"
    # Avoid collision when parallel shards start the same cell in the same second.
    # A replicate-fill plan makes every run of a cell identical, so the
    # second-resolution timestamp is the ONLY distinguishing part of the name --
    # simultaneous shards reliably collide.
    #
    # `mkdir` (no -p) is the atomic claim: it fails if the directory already
    # exists, so exactly one shard can win a given name. A check-then-create
    # guard (`[ -d ] || mkdir -p`) does NOT work here -- both shards test before
    # either creates, both see a free path, and `mkdir -p` then succeeds for
    # both. The loser only discovers the collision later, when it copies config
    # into a directory another shard is already populating.
    suffix=1
    until mkdir "$run_dir" 2>/dev/null; do
        suffix=$((suffix + 1))
        run_dir="$RUNS_DIR/${run_name}-${suffix}"
    done
    # Every stack is a directory under experiments/stacks. install.sh is the
    # stack's contract with this script and is invoked from there, so it is
    # removed from the run directory again: the recorded artifact should
    # contain the project, not the lab's plumbing.
    cp -r "$STACKS_DIR/$stack/." "$run_dir/"
    rm -f "$run_dir/install.sh"
    # .gitkeep exists only so git can track the stack's empty src/ and tests/
    # directories. It is not part of the project the agent is handed.
    find "$run_dir" -name .gitkeep -delete

    # Detect harness from workflow definition. .pi/ marks a pi workflow,
    # .opencode/ an OpenCode workflow, .cursor/ a cursor-agent workflow,
    # .claude/ a Claude Code workflow.
    # The marker dir is also the source of harness-specific config.
    wf_src="$(wf_path "$workflow")"
    if [ -d "$wf_src/.pi" ]; then
        harness=pi
    elif [ -d "$wf_src/.opencode" ]; then
        harness=opencode
    elif [ -d "$wf_src/.cursor" ]; then
        harness=cursor
    elif [ -d "$wf_src/.claude" ]; then
        harness=claude
    else
        echo -e "  ${RED}ERROR: workflow $workflow has neither .claude/, .opencode/, .cursor/, nor .pi/${NC}"
        failed_count=$((failed_count + 1))
        continue
    fi

    # Copy workflow config
    if [ "$harness" = "claude" ]; then
        cp -r "$wf_src/.claude" "$run_dir/"
    elif [ "$harness" = "opencode" ]; then
        # Mirror the marker dir AND promote opencode.json / AGENTS.md to
        # run_dir root, because OpenCode reads those from cwd, not from
        # .opencode/.
        cp -r "$wf_src/.opencode" "$run_dir/"
        [ -f "$wf_src/.opencode/opencode.json" ] && \
            cp "$wf_src/.opencode/opencode.json" "$run_dir/"
        [ -f "$wf_src/.opencode/AGENTS.md" ] && \
            cp "$wf_src/.opencode/AGENTS.md" "$run_dir/"
    elif [ "$harness" = "pi" ]; then
        # Mirror .pi/ into run_dir. pi reads AGENTS.md via cwd walk-up.
        # Project-local skills (.pi/skills/), agents (.pi/agents/) and the
        # subagent extension (.pi/extensions/subagent/) are all workflow-local
        # and discovered by pi from the run_dir cwd (project-local extension
        # dir = cwd/.pi/extensions/). Only the provider config (models.json)
        # comes from the global /home/experimenter/.pi/agent/ bind-mount.
        cp -r "$wf_src/.pi" "$run_dir/"
        [ -f "$wf_src/.pi/AGENTS.md" ] && \
            cp "$wf_src/.pi/AGENTS.md" "$run_dir/"
    elif [ "$harness" = "cursor" ]; then
        # Mirror .cursor/ into run_dir. cursor-agent reads AGENTS.md via cwd
        # walk-up (same pattern as pi/opencode), auto-loads project-local
        # skills from .cursor/skills/, and resolves subagents from
        # .cursor/agents/ (native Task tool — no extension needed, unlike pi).
        # The recursive copy covers both subdirs; keep it recursive.
        cp -r "$wf_src/.cursor" "$run_dir/"
        [ -f "$wf_src/.cursor/AGENTS.md" ] && \
            cp "$wf_src/.cursor/AGENTS.md" "$run_dir/"
    fi

    # Copy kata prompt
    if [ -f "$KATAS_DIR/$kata/prompt.md" ]; then
        cp "$KATAS_DIR/$kata/prompt.md" "$run_dir/"
    fi

    # Harness CLI version, recorded per run. Without it a version bump is
    # invisible after the fact: runs from before and after look identical in
    # metrics.json, so a CLI change cannot be separated from a model or
    # workflow effect (the confound RQ-1.19 F-1.19.9 had to rule out by hand
    # for a container rebuild). Best-effort — an unknown version must not
    # abort a run.
    case "$harness" in
        pi)       harness_version="$(pi --version 2>/dev/null | head -1)" ;;
        opencode) harness_version="$(opencode --version 2>/dev/null | head -1)" ;;
        cursor)   harness_version="$(cursor-agent --version 2>/dev/null | head -1)" ;;
        *)        harness_version="$(claude --version 2>/dev/null | head -1)" ;;
    esac
    [ -n "$harness_version" ] || harness_version="unknown"

    # Record start
    cat > "$run_dir/metrics.json" << EOF
{
  "kata": "$kata",
  "workflow": "$workflow",
  "model": "$model_name",
  "stack": "$stack",
  "cli_model": "$cli_model",
  "harness_version": "$harness_version",
  "thinking": $thinking,
  "started_at": "$(date -Iseconds)",
  "ended_at": null,
  "duration_seconds": null,
  "batch_run": true,
  "plan_file": $( [ -n "$PLAN_FILE" ] && echo "\"$PLAN_FILE\"" || echo "null" )
}
EOF

    # Each stack brings its own install command. A broken install is an
    # infrastructure failure: stop before invoking the model, not a kata result.
    echo -e "  Installing dependencies..."
    if ! (cd "$run_dir" && "$STACKS_DIR/$stack/install.sh"); then
        echo "Dependency installation failed in $run_dir; aborting batch before model invocation." >&2
        exit 1
    fi

    echo -e "  Initializing isolated Git repository..."
    init_run_git "$run_dir" || exit 1

    # Run the harness CLI with timeout + capture log + tolerate non-zero exit.
    # Name the actual CLI — a hardcoded "Claude Code" here made pi/oc/cursor
    # runs look like they had been dispatched to the wrong harness.
    case "$harness" in
        pi)       harness_label="pi" ;;
        opencode) harness_label="OpenCode" ;;
        cursor)   harness_label="cursor-agent" ;;
        *)        harness_label="Claude Code" ;;
    esac
    # $cli_model is a placeholder for the non-CC harnesses ("pi-only",
    # "oc-only", "cursor-only") — the real --model string is resolved in each
    # harness branch further down. Printing the placeholder made the logs
    # useless for telling which model a shard was actually running, which is
    # exactly what you need when a batch fails. Show the lab-variant name and,
    # where it differs, the resolved CLI id.
    case "$cli_model" in
        pi-only|oc-only|cursor-only) model_display="$model_name" ;;
        *)                           model_display="$cli_model" ;;
    esac
    echo -e "  Running $harness_label... (model: $model_display, thinking: $thinking)"
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
            # A transiently cut TCR session may already have committed partial
            # work. Every retry must start from the identical kata baseline.
            # `git clean -fd` respects .gitignore, preserving node_modules and
            # harness artifacts while removing untracked source attempts.
            (cd "$run_dir" && \
                initial_commit=$(git rev-list --max-parents=0 HEAD | head -1) && \
                git reset --hard "$initial_commit" && git clean -fd) >/dev/null
            : > "$run_log"
        fi

        set +e
        if [ "$harness" = "pi" ]; then
            # Lab-variant model name → pi --model format. Walking skeleton:
            # only Opus 4.7 wired. Portkey was retired; pi now routes via
            # Requesty (provider=requesty, bedrock/claude-opus-4-7@eu-west-1).
            # pi's models.json (bind-mounted from pi-config/) defines
            # provider=requesty with api:"openai-completions" + Bearer auth
            # ($REQUESTY_API_KEY), so REQUESTY_API_KEY in the env is
            # sufficient for auth. The -portkey model-name suffix is kept as
            # the RQ-controls label only; it no longer implies Portkey routing.
            # Lab-variant → requesty/<provider>/<id>. Backprovider is pinned
            # per lab-variant (id encodes the routing path); a changed
            # backprovider needs a new lab-variant. IDs mirror
            # pi-config/agent/models.json exactly.
            #
            # Reasoning on/off is a per-invocation setting in pi
            # (`--thinking off|minimal|low|…|max`), NOT a separate model
            # entry. A trailing `-no-thinking` on the lab-variant selects the
            # reasoning-off arm: strip it to resolve the routing id via the
            # base case below, and remember to pass `--thinking off`. Bare
            # ids keep the model's default reasoning (on). This is analogous
            # to the claude branch's MAX_THINKING_TOKENS=0 handling.
            pi_thinking=""   # empty = model default; "off" = reasoning off
            model_base="$model_name"
            if [[ "$model_base" == *-no-thinking ]]; then
                # Two id families are matched verbatim in the case below
                # instead of being stripped:
                #   *-portkey-no-thinking  — historical labels, predate the
                #                            suffix convention.
                #   *-codex-no-thinking    — OpenAI-subscription route, both
                #                            arms listed explicitly so the
                #                            routing id is visible per arm.
                # Stripping either would leave its case entry unreachable, so
                # the reasoning-off flag is set here rather than below.
                if [[ "$model_base" == *-codex-no-thinking ]]; then
                    pi_thinking="off"
                elif [[ "$model_base" != *-portkey-no-thinking ]]; then
                    model_base="${model_base%-no-thinking}"
                    pi_thinking="off"
                fi
            fi
            case "$model_base" in
                opus-4-7-portkey)              pi_model="requesty/bedrock/claude-opus-4-7@eu-west-1" ;;
                opus-4-7-portkey-no-thinking)  pi_model="requesty/bedrock/claude-opus-4-7@eu-west-1" ;;
                # --- RQ-model-quality-pi / RQ-model-novel-pi matrix ---
                # Each id also has a `<id>-no-thinking` lab-variant (same
                # routing, --thinking off) registered in MODEL_CONFIGS; the
                # suffix is stripped above so both resolve here.
                opus-4-8)                      pi_model="requesty/vertex/claude-opus-4-8@eu" ;;
                sonnet-5)                      pi_model="requesty/vertex/claude-sonnet-5@eu" ;;
                opus-5-requesty)               pi_model="requesty/vertex/claude-opus-5@eu" ;;
                gpt-5-6-sol)                   pi_model="requesty/azure/gpt-5.6-sol@swedencentral" ;;
                # OpenAI-subscription route. Both reasoning arms are listed
                # explicitly (not suffix-stripped) so each id shows its own
                # routing target; the strip guard above skips *-codex-* and
                # sets --thinking off for the -no-thinking arm.
                #
                # The `openai-codex/` provider prefix is mandatory: a bare
                # `gpt-5.6-sol` resolves against the azure-openai-responses
                # entry instead and dies with "No API key found for
                # azure-openai-responses".
                gpt-5-6-sol-codex)             pi_model="openai-codex/gpt-5.6-sol" ;;
                gpt-5-3-codex-spark)           pi_model="openai-codex/gpt-5.3-codex-spark" ;;
                gpt-5-6-sol-codex-no-thinking) pi_model="openai-codex/gpt-5.6-sol" ;;
                gpt-6-astra-codex)             pi_model="openai-codex/gpt-6-astra" ;;
                gpt-6-astra-codex-no-thinking) pi_model="openai-codex/gpt-6-astra" ;;
                gpt-6-sol-codex)               pi_model="openai-codex/gpt-6-sol" ;;
                # 2x2 matrix arms. The route id is identical to its base arm --
                # the reasoning difference lives in the pi-config profile, not
                # in the model string (a made-up model id is rejected upstream:
                # "The 'gpt-5.6-sol-noreason' model is not supported when using
                # Codex with a ChatGPT account").
                gpt-5-6-sol-reasoning)         pi_model="requesty/azure/gpt-5.6-sol@swedencentral" ;;
                gpt-5-6-sol-codex-noreason)    pi_model="openai-codex/gpt-5.6-sol" ;;
                gpt-5-6-terra)                 pi_model="requesty/azure/gpt-5.6-terra@swedencentral" ;;
                glm-5-1)                       pi_model="requesty/nebius/zai-org/glm-5.1" ;;
                glm-5-2)                       pi_model="requesty/tensorx/glm-5.2" ;;
                kimi-k2-7)                     pi_model="requesty/tensorx/kimi-k2.7-code" ;;
                # One underlying model, two routes, one id each -- the route is
                # always explicit in the id. Keep both so a routing comparison
                # stays possible.
                #
                # 2026-07-28: sference/kimi-k3 reproducibly died mid-run with
                # Requesty 502 "problem with the provider stream" (2/2 smoke
                # runs), so nebius/kimi-k3 was added as a fallback. nebius then
                # showed its own instability -- 6/15 runs non-ok, mostly
                # claim-office timeouts.
                # 2026-08-04: Requesty reported the stream issue fixed. sference
                # is the preferred route again (prompt caching, double the max
                # output); kimi-k3-sference is the id the RQs now fill. The bare
                # `kimi-k3` id was retired with the pre-fix runs it produced --
                # those are archived under
                # experiments/runs/_archive/kimi-k3-preroute-fix-2026-08-04/.
                kimi-k3-sference)              pi_model="requesty/sference/kimi-k3" ;;
                kimi-k3-nebius)                pi_model="requesty/nebius/kimi-k3" ;;
                minimax-m3)                    pi_model="requesty/tensorx/minimax-m3" ;;
                deepseek-v4-pro)               pi_model="requesty/tensorx/deepseek-v4-pro" ;;
                qwen3-235b)                    pi_model="requesty/nebius/qwen/qwen3-235b-a22b-instruct-2507" ;;
                *) echo -e "  ${RED}ERROR: no pi model mapping for $model_name${NC}"
                   claude_exit=2
                   pi_model="" ;;
            esac
            # Build the optional --thinking flag once, reused by the main
            # run and the cli.ts nudge below. Empty array = model default.
            pi_thinking_args=()
            [ "$pi_thinking" = "off" ] && pi_thinking_args=(--thinking off)
            # Subagents spawned by the workflow's subagent extension do not
            # inherit --model; without this they fall back to the
            # defaultModel in pi-config/agent/settings.json (Opus 4.7),
            # which contaminates the model factor of every pi run. The
            # extension reads PI_INHERIT_MODEL when the agent file itself
            # pins no model. See .pi/extensions/subagent/index.ts.
            export PI_INHERIT_MODEL="$pi_model"
            if [ -n "$pi_model" ]; then
                # Provider (Requesty) lives in /home/experimenter/.pi/agent/
                # (bind-mounted from experiments/docker/pi-config/). Project-
                # level skills, agents AND the subagent extension live in
                # $run_dir/.pi/ and are discovered by pi from the cwd
                # (project-local extension dir = cwd/.pi/extensions/).
                # --mode json writes the full event-stream JSONL to stdout —
                # redirect to $run_log only (no tee) so it doesn't flood the
                # batch shard log.
                # --approve trusts project-local files for this run. REQUIRED
                # for the workflow-local subagent extension: pi gates
                # project-local extensions (.pi/extensions/) behind project
                # trust, and in non-interactive -p mode there is no prompt to
                # grant it — without --approve the extension silently does not
                # load and the model has no `subagent` tool (refactorings_applied
                # drops to 0). --approve also covers project-local skills/agents.
                (cd "$run_dir" && \
                    timeout --signal=TERM --kill-after=30s "$CLAUDE_TIMEOUT_SECONDS" \
                    pi -p --approve --mode json --no-session --model "$pi_model" "${pi_thinking_args[@]}" \
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
                # opus-4-8 via Requesty: provider "requesty" (block in the
                # workflow's opencode.json), route format vertex/…@eu. Both the
                # -requesty and -requesty-no-thinking labels map to the same
                # upstream (OC has no thinking flag).
                opus-4-8-requesty|opus-4-8-requesty-no-thinking)  oc_model="requesty/vertex/claude-opus-4-8@eu" ;;
                # gpt-5.6-sol via Requesty (Azure swedencentral) — same upstream
                # route the pi branch uses. Requires the matching entry in the
                # workflow's opencode.json requesty provider block, otherwise
                # OC rejects the --model string.
                #
                # Requires "options": {"reasoningEffort": "minimal"} on this model
                # in the workflow's opencode.json. Without it the run dies with a
                # 400 from Requesty. Verified 2026-07-28 against the raw API:
                #
                #   tools + reasoning_effort=medium|low|none -> 400 "Function
                #     tools with reasoning_effort are not supported for
                #     gpt-5.6-sol in /v1/chat/completions."
                #   tools + reasoning_effort=minimal         -> 200 OK
                #   tools, no reasoning_effort               -> 200 OK
                #
                # "minimal" is the only accepted non-empty value, and it is what
                # makes this work on OC: OpenCode force-injects reasoning params
                # for any model *id* matching "gpt-5" (exempting only
                # "gpt-5-chat"/"gpt-5-pro"), defaulting to reasoningEffort
                # "medium" — which is one of the rejected values. The injection
                # cannot be removed, but model-level options DO override its
                # value, so pinning "minimal" lands an accepted request.
                #
                # Note "reasoning": false alone does NOT do this — it only
                # affects OC's own display/logic, the wire still carried
                # "medium". Confirmed end-to-end in docker-batch (oc 1.15.10):
                # multi-turn tool use, file written correctly.
                #
                # Upstream context: the same injection bug was fixed for Azure
                # gpt-5.5 in opencode PR #26222, but scope-locked to that model,
                # so 5.6 does not benefit. Requesty also maps /v1/responses down
                # to chat-completions, so that escape hatch is closed.
                #
                # Unlike pi (reasoning-off declared in pi-config/agent/
                # models.json), OC has no way to omit the parameter entirely —
                # hence the pinned value rather than a suppression.
                gpt-5-6-sol|gpt-5-6-sol-no-thinking)  oc_model="requesty/azure/gpt-5.6-sol@swedencentral" ;;
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
        elif [ "$harness" = "cursor" ]; then
            # Lab-variant model name → cursor-agent --model format. Verified
            # via smoke run 2026-07-26 (see research/questions-cursor-cli/).
            # Reasoning effort is encoded in the model id (-medium = no-thinking
            # baseline arm); composer-2.5 has no effort axis.
            case "$model_name" in
                opus-cursor)     cursor_model="claude-opus-4-8-medium" ;;
                composer-cursor) cursor_model="composer-2.5" ;;
                grok-cursor)     cursor_model="cursor-grok-4.5-medium" ;;
                auto-cursor)     cursor_model="auto" ;;
                *) echo -e "  ${RED}ERROR: no cursor model mapping for $model_name${NC}"
                   claude_exit=2
                   cursor_model="" ;;
            esac
            [ -n "$cursor_model" ] && echo -e "    → cursor-agent --model $cursor_model"
            if [ -n "$cursor_model" ]; then
                # cursor-agent -p is non-interactive; --force allows tool use
                # without prompts. --output-format stream-json emits the NDJSON
                # event stream the parser reads. --workspace pins cwd to run_dir
                # so edits land in the right place. Auth via CURSOR_API_KEY in
                # the container env. Redirect to $run_log only (no tee) — the
                # stream is verbose, same as the pi/opencode branches.
                (cd "$run_dir" && \
                    timeout --signal=TERM --kill-after=30s "$CLAUDE_TIMEOUT_SECONDS" \
                    cursor-agent -p --force --output-format stream-json \
                    --model "$cursor_model" --workspace "$run_dir" \
                    "Read prompt.md and complete the exercise following the workflow rules in AGENTS.md. Continue autonomously through ALL tests in the test list until you have written experiment-done.txt with the single word DONE. Do NOT stop after a single passing test or cycle — keep going until every test is implemented.") \
                    > "$run_log" 2>&1
                claude_exit=$?
            fi
        elif [ "$thinking" = "false" ]; then
            (cd "$run_dir" && "${cc_env[@]}" env MAX_THINKING_TOKENS=0 timeout --signal=TERM --kill-after=30s "$CLAUDE_TIMEOUT_SECONDS" \
                claude --dangerously-skip-permissions --strict-mcp-config --model "$cli_model" --print \
                "Read prompt.md and complete the exercise following the workflow rules.") \
                2>&1 | tee "$run_log"
            claude_exit=${PIPESTATUS[0]}
        else
            (cd "$run_dir" && "${cc_env[@]}" timeout --signal=TERM --kill-after=30s "$CLAUDE_TIMEOUT_SECONDS" \
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
        quota_exhausted="false"
        pi_retries_exhausted="false"
        transient_reason=""
        if [ "$claude_exit" -ne 0 ]; then
            # NON-RETRYABLE QUOTA EXHAUSTION — check before the rate-limit
            # branch, whose "usage limit" pattern would otherwise swallow it.
            #
            # cursor-agent raises ActionRequiredError when the Cursor plan's
            # monthly model allowance is spent:
            #   "ActionRequiredError: You've hit your usage limit for Opus …
            #    Your usage limits will reset when your monthly cycle ends
            #    on 8/2/2026."
            # This does NOT clear within a batch — the reset is days away and
            # needs a plan change or a spend limit. Retrying burns the whole
            # backoff ladder (60s→5min→30min→1h→2h ≈ 3.7h per run) for an
            # error that is guaranteed to still be there at the end of it.
            # Fail fast so the operator sees it immediately.
            if grep -qiE "ActionRequiredError|usage limits will reset|set a Spend Limit" "$run_log" 2>/dev/null; then
                quota_exhausted="true"
                transient_reason="Plan quota exhausted (non-retryable)"
                echo -e "  ${RED}Plan quota exhausted — not retryable. Stopping this run.${NC}"
                grep -oiE "You've hit your usage limit for [A-Za-z0-9.-]+" "$run_log" 2>/dev/null | head -1 | sed 's/^/    /'
                grep -oiE "reset when your monthly cycle ends on [0-9/]+" "$run_log" 2>/dev/null | head -1 | sed 's/^/    /'
            # "hit your limit" / "resets <time>" is the Anthropic
            # subscription-quota signature shown by the Claude CLI when
            # the daily/weekly cap is reached (different from API
            # 429/529). Treated as rate-limit so the retry/backoff path
            # waits it out instead of failing the batch.
            elif grep -qiE "rate.?limit|\b429\b|\b529\b|usage limit|overloaded|hit your limit|resets [0-9]+(:[0-9]+)?\s*[ap]m" "$run_log" 2>/dev/null; then
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
            if [ "$harness" = "pi" ]; then
                # pi runs its own auto-retry ladder inside the process. When
                # that ladder is exhausted it gives up, emits
                #   {"type":"auto_retry_end","success":false,"finalError":"…"}
                # and exits 0 — so the exit code alone reports "ok" for a run
                # that never produced a line of code. Observed with Requesty
                # 502 "problem with the provider stream" (sference/kimi-k3),
                # but the signature is provider-agnostic.
                #
                # Matched on the JSONL event, not on prose, so model output
                # mentioning "auto_retry_end" cannot forge it: the event is
                # emitted by pi itself at top level of a log line.
                # Deliberately NOT flagged transient: pi has already spent
                # its own retry ladder on this error, so an upstream issue
                # that survived that is not a seconds-long hiccup. Adding
                # the outer backoff ladder (60s→5min→30min→1h→2h) on top
                # would burn ~3.7h per run for an error that is very likely
                # still there afterwards. Fail the run, keep the batch
                # moving — same rationale as the quota-exhausted branch.
                if grep -qE '"type":"auto_retry_end","success":false' "$run_log" 2>/dev/null; then
                    pi_retries_exhausted="true"
                    echo -e "  ${RED}pi exhausted its internal retries — marking run failed.${NC}"
                    grep -oE '"finalError":"[^"]{0,120}' "$run_log" 2>/dev/null | tail -1 | sed 's/^/    /'
                fi
            elif [ "$harness" = "claude" ]; then
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
        #
        # Four event types are dropped on the way in. Each carries the FULL
        # accumulated buffer on every streamed chunk, so a message growing to
        # 1 MB is re-serialized once per token — quadratic in message length.
        # thinking_delta / text_delta do this for model output,
        # toolcall_delta for growing command arguments, and
        # tool_execution_update for subagent output. Which one dominates
        # depends on the workflow (97% thinking_delta on a minimax v6.2 run,
        # 97% tool_execution_update on a gpt-5-6-sol v4.1 run), so all four
        # must go. None of them is read by parse_pi_transcript.py: it consumes
        # message_update only for toolcall*/text_end, plus message_end,
        # turn_end, agent_end and tool_execution_end.
        # Verified 2026-08-31 across 18 runs (3 targeted + 15 random):
        # transcript-metrics.json is bit-identical with and without them.
        # Historic pool: 71 GB -> 13 GB.
        if [ -f "$run_log" ]; then
            grep -E '^\{"type":' "$run_log" 2>/dev/null \
                | grep -vF '"assistantMessageEvent":{"type":"thinking_delta"' \
                | grep -vF '"assistantMessageEvent":{"type":"text_delta"' \
                | grep -vF '"assistantMessageEvent":{"type":"toolcall_delta"' \
                | grep -vF '{"type":"tool_execution_update"' \
                > "$run_dir/transcript-pi.jsonl" || true
            # run.log holds the same event stream verbatim and reached 6.5 GB
            # on a single run. The failure-diagnosis greps above (rate limit,
            # API error, auto_retry_end) have already consumed it, and the
            # NDJSON is now preserved in transcript-pi.jsonl, so only the
            # non-JSON lines (stack traces, nudge follow-ups) still carry
            # debugging value. Shrinks 22 GB of historic run.log to a few MB.
            if grep -vE '^\{"type":' "$run_log" > "$run_log.filtered" 2>/dev/null; then
                mv -f "$run_log.filtered" "$run_log"
            else
                : > "$run_log"          # stream was pure NDJSON: nothing left
                rm -f "$run_log.filtered"
            fi
        fi
    elif [ "$harness" = "cursor" ]; then
        # cursor-agent --output-format stream-json writes the NDJSON event
        # stream to stdout (redirected to $run_log). Extract the pure JSON
        # lines into transcript-cursor.jsonl for parse_cursor_transcript.py.
        # Without this branch cursor would fall through to save_transcript,
        # which looks for a non-existent Claude project dir and warns.
        if [ -f "$run_log" ]; then
            grep -E '^\{"type":' "$run_log" > "$run_dir/transcript-cursor.jsonl" 2>/dev/null || true
        fi
    else
        save_transcript "$run_dir"
    fi

    # Export before any harness-authored nudge changes the product outside the
    # measured workflow. The final source tree remains in place after .git is
    # removed; only the nested repository metadata is discarded.
    echo -e "  Exporting isolated Git history..."
    export_run_git "$run_dir" || exit 1

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
            (cd "$run_dir" && "${cc_env[@]}" env MAX_THINKING_TOKENS=0 timeout --signal=TERM --kill-after=30s 120 \
                claude --dangerously-skip-permissions --strict-mcp-config --model "$cli_model" --print \
                "The file src/cli.ts is missing. The prompt requires a CLI entry point at src/cli.ts that reads JSON from stdin and writes JSON to stdout. Create src/cli.ts now. It should import from your existing module and wire up stdin reading, processing, and stdout output.") \
                2>&1 | tee -a "$run_log"
        else
            (cd "$run_dir" && "${cc_env[@]}" timeout --signal=TERM --kill-after=30s 120 \
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

    # --- cli.ts nudge (pi harness) --------------------------------------
    # Same measurement-artefact fix as the claude branch above, but routed
    # through pi. Non-Anthropic models via Requesty (qwen, minimax, …) tend
    # to skip src/cli.ts even though AGENTS.md demands it, which scores a
    # false 0/15 on verification. Re-uses the resolved $pi_model and the same
    # pi invocation flags as the main run (--approve for project-local
    # skills/agents/extension; --mode json --no-session).
    if [ "$harness" = "pi" ] && [ "$claude_exit" -eq 0 ] \
            && [ "$rate_limited" = "false" ] && [ "$transient_api_error" = "false" ] \
            && [ "$pi_retries_exhausted" = "false" ] \
            && [ -n "$pi_model" ] \
            && [ ! -f "$run_dir/src/cli.ts" ] && [ -f "$run_dir/src/claim-office.ts" ]; then
        echo -e "  ${YELLOW}src/cli.ts missing — nudging pi agent to create it...${NC}"
        set +e
        (cd "$run_dir" && timeout --signal=TERM --kill-after=30s 120 \
            pi -p --approve --mode json --no-session --model "$pi_model" "${pi_thinking_args[@]}" \
            "The file src/cli.ts is missing. The prompt requires a CLI entry point at src/cli.ts that reads JSON from stdin and writes JSON to stdout. Create src/cli.ts now. It should import from your existing module and wire up stdin reading, processing, and stdout output.") \
            >> "$run_log" 2>&1
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
    # pi gave up after its own retry ladder and still exited 0. Without this
    # the run is filed as "ok" with zero cycles and no code — indistinguishable
    # in aggregation from a model that simply failed the kata.
    [ "$pi_retries_exhausted" = "true" ] && exit_reason="pi-retries-exhausted"
    # Distinct from rate-limited: the plan allowance is gone until a billing
    # cycle reset, so no amount of waiting inside this batch helps. Kept as
    # its own reason so aggregation does not read it as a transient blip.
    [ "$quota_exhausted" = "true" ]     && exit_reason="quota-exhausted"
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
    # Failed runs. Beyond a non-zero exit code, two failure modes leave the
    # process exiting 0 and need their flags checked explicitly:
    # quota-exhausted (cursor plan allowance) and pi-retries-exhausted (pi
    # gave up after its own retry ladder). Without them the run falls
    # through to the OK branch, and the batch summary reads
    # "OK: 1, Failed: 0" for a run that produced no code at all.
    elif [ "$claude_exit" -ne 0 ] \
            || [ "$quota_exhausted" = "true" ] \
            || [ "$pi_retries_exhausted" = "true" ]; then
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
