#!/bin/bash
# Status snapshot of running (or finished) batches.
# Usage:
#   ./watch-batch.sh              # auto-detect: shows ALL running docker-batch-run containers,
#                                 # falls back to last plan from batch.log if none running
#   ./watch-batch.sh PLAN_NAME    # explicit plan name (e.g. smart-subset, game-of-life-stability)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

LOG_FILE="batch.log"
RUNS_DIR="../runs"
PLANS_DIR="../batch-plans"

# Render one snapshot for a (plan_name, container_name_or_empty, log_source) triple.
# log_source can be a file path or "docker:<container_name>" for live container logs.
render_snapshot() {
    local plan_name="$1"
    local container="$2"      # may be empty
    local log_source="$3"
    local started_at="$4"     # epoch seconds, may be empty

    local plan_file="$PLANS_DIR/${plan_name}.json"
    if [ ! -f "$plan_file" ]; then
        echo "  Plan file not found: $plan_file" >&2
        return 1
    fi

    local total
    total=$(jq '.runs | length' "$plan_file")

    # Read log content depending on source.
    local log_text=""
    if [[ "$log_source" == docker:* ]]; then
        local cname="${log_source#docker:}"
        log_text=$(docker logs "$cname" 2>&1 || true)
    elif [ -f "$log_source" ]; then
        log_text=$(cat "$log_source" 2>/dev/null || true)
    fi

    # Counter from log: last "[N/total]" marker
    local current
    current=$(echo "$log_text" | grep -oE '\[[0-9]+/[0-9]+\]' | tail -1 | tr -d '[]' || true)
    current="${current:-0/$total}"

    # Container state line
    local container_state
    if [ -n "$container" ]; then
        local cstatus
        cstatus=$(docker ps --filter "name=$container" --format '{{.Status}}' 2>/dev/null | head -1 || true)
        if [ -n "$cstatus" ]; then
            container_state="RUNNING ($cstatus) — $container"
        else
            container_state="STOPPED — $container"
        fi
    else
        container_state="STOPPED (no container)"
    fi

    # Run dirs created since started_at (or log mtime as fallback)
    local ref_ts="${started_at:-0}"
    if [ "$ref_ts" = "0" ] && [ -f "$log_source" ]; then
        ref_ts=$(stat -c %Y "$log_source" 2>/dev/null || echo 0)
    fi
    local fresh_runs
    fresh_runs=$(find "$RUNS_DIR" -maxdepth 1 -mindepth 1 -type d -newermt "@$ref_ts" 2>/dev/null | wc -l)

    echo "═══════════════════════════════════════════════════"
    echo "  Batch status: $plan_name"
    echo "═══════════════════════════════════════════════════"
    echo "  Plan total runs:   $total"
    echo "  Counter (log):     $current"
    echo "  Run dirs created:  $fresh_runs (since start)"
    echo "  Container:         $container_state"
    echo "  Log source:        $log_source"
    echo
    echo "─── last 10 log lines ──────────────────────────────"
    echo "$log_text" | tail -n 10 | sed 's/\x1b\[[0-9;]*m//g'
    echo "────────────────────────────────────────────────────"
    echo
}

# Extract BATCH_PLAN env from a container, strip .json, return plan name.
plan_from_container() {
    local cname="$1"
    docker inspect "$cname" --format '{{range .Config.Env}}{{println .}}{{end}}' 2>/dev/null \
        | grep '^BATCH_PLAN=' | head -1 | cut -d= -f2- | sed 's/\.json$//'
}

container_started_at_epoch() {
    local cname="$1"
    local iso
    iso=$(docker inspect "$cname" --format '{{.State.StartedAt}}' 2>/dev/null || true)
    [ -z "$iso" ] && { echo 0; return; }
    date -d "$iso" +%s 2>/dev/null || echo 0
}

# Last "Plan: <path>" line from batch.log, returns plan name or empty.
plan_from_logfile() {
    [ -f "$LOG_FILE" ] || return
    grep -oE 'Plan:[[:space:]]+\S+' "$LOG_FILE" 2>/dev/null \
        | tail -1 | awk '{print $2}' | xargs -I{} basename {} .json 2>/dev/null
}

# ---------------------------------------------------------------------------
# Mode dispatch
# ---------------------------------------------------------------------------

if [ $# -ge 1 ]; then
    # Explicit plan name; try to find a matching running container, else fall back to batch.log.
    plan="$1"
    plan="${plan%.json}"
    found=""
    while read -r cname; do
        [ -z "$cname" ] && continue
        cplan=$(plan_from_container "$cname")
        if [ "$cplan" = "$plan" ]; then
            found="$cname"
            break
        fi
    done < <(docker ps --filter "name=docker-batch-run" --format '{{.Names}}')

    if [ -n "$found" ]; then
        started=$(container_started_at_epoch "$found")
        render_snapshot "$plan" "$found" "docker:$found" "$started"
    else
        render_snapshot "$plan" "" "$LOG_FILE" ""
    fi
    echo "Live tail (running): docker logs -f <container>"
    echo "Live tail (file):    tail -f $SCRIPT_DIR/$LOG_FILE"
    exit 0
fi

# No argument: enumerate running batch containers.
mapfile -t containers < <(docker ps --filter "name=docker-batch-run" --format '{{.Names}}')

if [ "${#containers[@]}" -gt 0 ]; then
    for cname in "${containers[@]}"; do
        plan=$(plan_from_container "$cname")
        plan="${plan:-<unknown>}"
        plan="${plan%.json}"
        started=$(container_started_at_epoch "$cname")
        render_snapshot "$plan" "$cname" "docker:$cname" "$started" || true
    done
    echo "Live tail: docker logs -f <container>"
    exit 0
fi

# No running container — show last finished batch from batch.log.
last_plan=$(plan_from_logfile)
if [ -n "$last_plan" ]; then
    echo "(no running batch — showing last entry from $LOG_FILE)"
    echo
    render_snapshot "$last_plan" "" "$LOG_FILE" ""
    echo "Live tail (file): tail -f $SCRIPT_DIR/$LOG_FILE"
else
    echo "No running batch and no plan found in $LOG_FILE." >&2
    echo "Pass a plan name explicitly: $0 PLAN_NAME" >&2
    exit 1
fi
