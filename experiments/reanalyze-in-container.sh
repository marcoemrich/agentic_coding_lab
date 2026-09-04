#!/usr/bin/env bash
#
# Re-run analyze-run.sh for one or more runs INSIDE the batch container.
#
# Why this exists: analyze-run.sh shells out to the package manager for the
# verification stage. Running it on the host uses whatever pnpm the host has,
# which is not the pinned version the runs were produced with. On a mismatch
# the CLI never starts, every scenario "fails", and verification_pct is
# rewritten to 0 — a plausible-looking number that reads as a correctness
# collapse. Worse, the host package manager mutates the run's node_modules.
#
# Reanalysis exists to be compared against runs that were NOT reanalyzed, so
# the environment has to match the batch environment exactly. That is what
# this wrapper guarantees.
#
# Usage:
#   reanalyze-in-container.sh <run_dir> [<run_dir> ...]
#   reanalyze-in-container.sh --rq <rq_dir>      # every run in the RQ's runs.csv
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE="${BATCH_IMAGE:-docker-batch:latest}"
CONTAINER_EXP=/home/experimenter/experiments

usage() { sed -n '2,22p' "$0"; exit 1; }
[ $# -eq 0 ] && usage

run_names=()
if [ "${1:-}" = "--rq" ]; then
    [ $# -eq 2 ] || usage
    csv="$2/runs.csv"
    [ -f "$csv" ] || { echo "No runs.csv in $2 — aggregate first." >&2; exit 1; }
    # run_id column holds the run dir name
    col=$(head -1 "$csv" | tr ',' '\n' | grep -n '^run_id$' | cut -d: -f1)
    [ -n "$col" ] || { echo "runs.csv has no run_id column" >&2; exit 1; }
    while IFS= read -r r; do [ -n "$r" ] && run_names+=("$r"); done \
        < <(tail -n +2 "$csv" | cut -d, -f"$col" | sort -u)
else
    for d in "$@"; do
        [ -d "$d" ] || { echo "Not a directory: $d" >&2; exit 1; }
        run_names+=("$(basename "${d%/}")")
    done
fi

[ ${#run_names[@]} -eq 0 ] && { echo "Nothing to reanalyze." >&2; exit 1; }
echo "Reanalyzing ${#run_names[@]} run(s) in $IMAGE"

# One container for the whole set — startup is paid once, not per run.
docker run --rm \
    -v "$SCRIPT_DIR/katas:$CONTAINER_EXP/katas:ro" \
    -v "$SCRIPT_DIR/runs:$CONTAINER_EXP/runs:rw" \
    -v "$SCRIPT_DIR/analyze-run.sh:$CONTAINER_EXP/analyze-run.sh:ro" \
    -v "$SCRIPT_DIR/analyze_transcript.py:$CONTAINER_EXP/analyze_transcript.py:ro" \
    -v "$SCRIPT_DIR/measure-tdd-rigour.py:$CONTAINER_EXP/measure-tdd-rigour.py:ro" \
    -v "$SCRIPT_DIR/parse_opencode_transcript.py:$CONTAINER_EXP/parse_opencode_transcript.py:ro" \
    -v "$SCRIPT_DIR/parse_pi_transcript.py:$CONTAINER_EXP/parse_pi_transcript.py:ro" \
    -v "$SCRIPT_DIR/parse_cursor_transcript.py:$CONTAINER_EXP/parse_cursor_transcript.py:ro" \
    -v "$SCRIPT_DIR/docker/Dockerfile:$CONTAINER_EXP/docker/Dockerfile:ro" \
    -w "$CONTAINER_EXP" "$IMAGE" \
    bash -c '
        ok=0; failed=0; failed_names=""
        for r in "$@"; do
            if [ ! -d "runs/$r" ]; then
                echo "  SKIP (missing): $r"; failed=$((failed+1)); failed_names="$failed_names $r"; continue
            fi
            # A single bad run must not abort the whole set.
            if ./analyze-run.sh "'"$CONTAINER_EXP"'/runs/$r" >/tmp/re.log 2>&1; then
                echo "  ok:   $r"; ok=$((ok+1))
            else
                echo "  FAIL: $r (exit $?)"; tail -5 /tmp/re.log | sed "s/^/        /"
                failed=$((failed+1)); failed_names="$failed_names $r"
            fi
        done
        echo "---"
        echo "reanalyzed: $ok   failed: $failed"
        [ -n "$failed_names" ] && echo "failed runs:$failed_names"
        [ "$failed" -eq 0 ]
    ' _ "${run_names[@]}"
