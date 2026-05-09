#!/usr/bin/env bash
# Re-runs analyze-run.sh on every run dir under runs/.
# For runs without node_modules/, runs `pnpm install` first using the
# shared store at runs/.pnpm-store. node_modules/ is left in place.
#
# Use this after changes to analyze-run.sh that add new metrics
# (e.g. mccabe_*/cognitive_* added 2026-05-09) so existing runs get
# the new fields populated.
set -euo pipefail

EXPERIMENTS_DIR="$(cd "$(dirname "$0")" && pwd)"
RUNS_DIR="$EXPERIMENTS_DIR/runs"
STORE_DIR="$RUNS_DIR/.pnpm-store"

cd "$RUNS_DIR"

total=0
installed=0
analyzed=0
failed=0

for run in */; do
    run="${run%/}"
    [ -d "$run" ] || continue
    [ -f "$run/metrics.json" ] || { echo "SKIP $run (no metrics.json)"; continue; }
    total=$((total + 1))

    if [ ! -d "$run/node_modules" ]; then
        echo ">>> [$total] pnpm install in $run"
        if (cd "$run" && pnpm install --store-dir "$STORE_DIR" --prefer-offline --silent 2>&1 | tail -5); then
            installed=$((installed + 1))
        else
            echo "    FAILED install: $run"
            failed=$((failed + 1))
            continue
        fi
    fi

    echo ">>> [$total] analyze $run"
    if bash "$EXPERIMENTS_DIR/analyze-run.sh" "$RUNS_DIR/$run" > /dev/null 2>&1; then
        analyzed=$((analyzed + 1))
    else
        echo "    FAILED analyze: $run"
        failed=$((failed + 1))
    fi
done

echo
echo "=========================================="
echo "Total runs:      $total"
echo "Installed:       $installed"
echo "Analyzed OK:     $analyzed"
echo "Failed:          $failed"
echo "=========================================="
