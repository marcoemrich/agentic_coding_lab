#!/bin/bash
# Generate a "remaining work" plan from an original plan, by subtracting
# all (kata, workflow, model) triples that already have a non-rate-limited
# run-dir on disk.
#
# Usage:
#   ./resume-plan.sh <plan-name>
#   # writes /tmp/<plan-name>-resume.json and prints its path
#
# Idempotent. Counts replicated entries: if the original plan has 3 copies
# of the same triple but only 1 successful run-dir exists, 2 remain.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

PLAN_NAME="${1:?Usage: $0 PLAN_NAME}"
PLAN_FILE="../batch-plans/${PLAN_NAME}.json"
RUNS_DIR="../runs"
OUT_FILE="/tmp/${PLAN_NAME}-resume.json"

if [ ! -f "$PLAN_FILE" ]; then
    echo "Plan not found: $PLAN_FILE" >&2
    exit 1
fi

# Build a "completed multiset": for each non-rate-limited run-dir, emit
# kata|workflow|model. Run-dir name format:
#   YYYY-MM-DD_HH-MM-SS_<kata>_<workflow>_<model>
# We use metrics.json (rate_limited flag) when present; if metrics.json
# is missing we treat the run as INCOMPLETE (do not count it as done).
completed_tmp=$(mktemp)
trap 'rm -f "$completed_tmp"' EXIT

for run_dir in "$RUNS_DIR"/*/; do
    [ -d "$run_dir" ] || continue
    metrics="$run_dir/metrics.json"
    [ -f "$metrics" ] || continue

    rate_limited=$(jq -r '.run_status.rate_limited // false' "$metrics" 2>/dev/null || echo "true")
    if [ "$rate_limited" = "true" ]; then
        continue
    fi

    kata=$(jq -r '.kata // ""' "$metrics" 2>/dev/null)
    workflow=$(jq -r '.workflow // ""' "$metrics" 2>/dev/null)
    model=$(jq -r '.model // ""' "$metrics" 2>/dev/null)

    # Fallback: parse from dir name if metrics missing fields.
    if [ -z "$kata" ] || [ -z "$workflow" ] || [ -z "$model" ]; then
        continue
    fi

    echo "$kata|$workflow|$model" >> "$completed_tmp"
done

# Read original plan triples in order; for each, if it exists in
# completed_tmp, "consume" one occurrence (decrement). Otherwise keep it.
remaining=$(jq -c '.runs[]' "$PLAN_FILE")

# Use awk to consume occurrences and emit remaining triples as TSV.
remaining_tsv=$(jq -r '.runs[] | [.kata, .workflow, .model] | @tsv' "$PLAN_FILE" \
    | awk -v completed_file="$completed_tmp" '
        BEGIN {
            FS="\t"; OFS="\t"
            while ((getline line < completed_file) > 0) {
                count[line]++
            }
            close(completed_file)
        }
        {
            key = $1 "|" $2 "|" $3
            if (key in count && count[key] > 0) {
                count[key]--
                next
            }
            print $1, $2, $3
        }
    ')

remaining_count=$(printf '%s\n' "$remaining_tsv" | grep -c '^.' || true)
total_count=$(jq '.runs | length' "$PLAN_FILE")

if [ "$remaining_count" -eq 0 ]; then
    echo "Plan '$PLAN_NAME' is COMPLETE: $total_count/$total_count runs done." >&2
    rm -f "$OUT_FILE"
    exit 0
fi

orig_name=$(jq -r '.name // ""' "$PLAN_FILE")
orig_desc=$(jq -r '.description // ""' "$PLAN_FILE")

# Emit resume plan
{
    echo '{'
    printf '  "name": %s,\n' "$(jq -Rn --arg s "[RESUME] $orig_name" '$s')"
    printf '  "description": %s,\n' "$(jq -Rn --arg s "Auto-generated resume plan ($remaining_count/$total_count runs remaining). Original: $orig_desc" '$s')"
    echo '  "runs": ['
    printf '%s\n' "$remaining_tsv" | awk -F'\t' '
        NR>1 { printf ",\n" }
        {
            printf "    {\"kata\": \"%s\", \"workflow\": \"%s\", \"model\": \"%s\"}", $1, $2, $3
        }
        END { print "" }
    '
    echo '  ]'
    echo '}'
} > "$OUT_FILE"

echo "Resume plan written: $OUT_FILE"
echo "  Remaining: $remaining_count / $total_count"
echo "Run with:  ./batch.sh $OUT_FILE"
