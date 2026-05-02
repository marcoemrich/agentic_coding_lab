#!/bin/bash
# Status snapshot of a running (or finished) batch.
# Usage: ./watch-batch.sh [PLAN_NAME]
#   PLAN_NAME defaults to smart-subset

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

PLAN_NAME="${1:-smart-subset}"
PLAN_FILE="../batch-plans/${PLAN_NAME}.json"
LOG_FILE="batch.log"
RUNS_DIR="../runs"

if [ ! -f "$PLAN_FILE" ]; then
    echo "Plan not found: $PLAN_FILE" >&2
    exit 1
fi

total=$(jq '.runs | length' "$PLAN_FILE")

# Counter from log: last "[N/total]" marker
current=$(grep -oE '\[[0-9]+/[0-9]+\]' "$LOG_FILE" 2>/dev/null | tail -1 | tr -d '[]' || true)
current="${current:-0/$total}"

# Container running?
container_status=$(docker ps --filter "name=docker-batch-run" --format '{{.Status}}' 2>/dev/null | head -1 || true)
if [ -z "$container_status" ]; then
    container_state="STOPPED"
else
    container_state="RUNNING ($container_status)"
fi

# Number of run dirs created since plan started (rough — uses log mtime)
plan_started=$(stat -c %Y "$LOG_FILE" 2>/dev/null || echo 0)
fresh_runs=$(find "$RUNS_DIR" -maxdepth 1 -mindepth 1 -type d -newermt "@$plan_started" 2>/dev/null | wc -l)

echo "═══════════════════════════════════════════════════"
echo "  Batch status: $PLAN_NAME"
echo "═══════════════════════════════════════════════════"
echo "  Plan total runs:   $total"
echo "  Counter (log):     $current"
echo "  Run dirs created:  $fresh_runs (since log start)"
echo "  Container:         $container_state"
echo
echo "─── last 10 log lines ──────────────────────────────"
tail -n 10 "$LOG_FILE" 2>/dev/null | sed 's/\x1b\[[0-9;]*m//g'
echo "────────────────────────────────────────────────────"
echo
echo "Live tail:  tail -f $SCRIPT_DIR/$LOG_FILE"
