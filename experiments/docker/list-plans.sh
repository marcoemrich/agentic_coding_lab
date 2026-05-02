#!/bin/bash
# List available batch plans with name, description, and run count.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLANS_DIR="$SCRIPT_DIR/../batch-plans"

if [ ! -d "$PLANS_DIR" ]; then
    echo "No plans directory at: $PLANS_DIR" >&2
    exit 1
fi

shopt -s nullglob
plans=("$PLANS_DIR"/*.json)
shopt -u nullglob

if [ ${#plans[@]} -eq 0 ]; then
    echo "No plan files found in: $PLANS_DIR"
    exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
    echo "jq is required to inspect plan files." >&2
    exit 3
fi

printf "%-50s %5s  %s\n" "PLAN" "RUNS" "DESCRIPTION"
printf "%-50s %5s  %s\n" "----" "----" "-----------"

for plan in "${plans[@]}"; do
    basename="$(basename "$plan")"
    runs=$(jq -r '.runs | length' "$plan" 2>/dev/null || echo "?")
    desc=$(jq -r '.description // .name // ""' "$plan" 2>/dev/null)
    printf "%-50s %5s  %s\n" "$basename" "$runs" "$desc"
done

echo
echo "Run with:  ./batch.sh PLAN_NAME"
