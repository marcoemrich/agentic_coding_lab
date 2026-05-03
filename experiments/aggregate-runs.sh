#!/bin/bash
# Aggregate metrics across runs of a batch plan.
#
# Usage:
#   ./aggregate-runs.sh <plan-name> [--out-dir DIR]
#   ./aggregate-runs.sh smart-subset
#   ./aggregate-runs.sh smart-subset --out-dir results/smart-subset
#
# Reads runs/<timestamp>_<kata>_<workflow>_<model>/metrics.json files
# whose (kata, workflow, model) triple is referenced in the plan, then
# emits:
#   <out>/runs.csv     — one row per run, all metrics
#   <out>/summary.md   — narrative report with per-cell aggregations
#
# Default out dir: results/<plan-name>/
#
# Idempotent: overwrites existing output files.

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

PLAN_NAME="${1:?Usage: $0 PLAN_NAME [--out-dir DIR]}"
shift

OUT_DIR="../results/$PLAN_NAME"
while [ $# -gt 0 ]; do
    case "$1" in
        --out-dir) OUT_DIR="$2"; shift 2 ;;
        *) echo "Unknown arg: $1" >&2; exit 1 ;;
    esac
done

PLAN_FILE="batch-plans/${PLAN_NAME}.json"
RUNS_DIR="runs"

if [ ! -f "$PLAN_FILE" ]; then
    echo "Plan not found: $PLAN_FILE" >&2
    exit 1
fi

mkdir -p "$OUT_DIR"
CSV="$OUT_DIR/runs.csv"
MD="$OUT_DIR/summary.md"

# ---------------------------------------------------------------------
# Step 1: collect all metrics.json files matching the plan triples.
#
# A plan can reference the same (kata, workflow, model) triple multiple
# times (replicates). We greedily match each plan slot to the OLDEST
# unmatched run-dir for that triple. Run-dirs not referenced in the plan
# are skipped (e.g. earlier smoke-tests).
# ---------------------------------------------------------------------

# Build list of plan triples with replicate index per triple.
plan_triples=$(jq -r '.runs[] | [.kata, .workflow, .model] | @tsv' "$PLAN_FILE")

# Collect candidate run-dirs grouped by (kata, workflow, model), sorted
# by directory name (= timestamp prefix), oldest first.
matched_csv_rows=()
matched_metrics_files=()

claim_run() {
    local kata="$1" workflow="$2" model="$3"
    local pattern="*_${kata}_${workflow}_${model}"
    # iterate in dir-name order (timestamp prefix => chronological)
    for d in $(ls -d "$RUNS_DIR"/$pattern/ 2>/dev/null | sort); do
        local m="$d/metrics.json"
        [ -f "$m" ] || continue
        # already claimed?
        local already=0
        for prev in "${matched_metrics_files[@]:-}"; do
            if [ "$prev" = "$m" ]; then already=1; break; fi
        done
        [ "$already" = "1" ] && continue
        echo "$m"
        return 0
    done
    return 1
}

while IFS=$'\t' read -r kata workflow model; do
    [ -z "$kata" ] && continue
    if m=$(claim_run "$kata" "$workflow" "$model"); then
        matched_metrics_files+=("$m")
    else
        echo "WARN: no run-dir for $kata / $workflow / $model" >&2
    fi
done <<<"$plan_triples"

echo "Matched ${#matched_metrics_files[@]} runs from plan ($(echo "$plan_triples" | wc -l) triples)" >&2

# ---------------------------------------------------------------------
# Step 2: emit CSV.
# Columns chosen to support pivots over (workflow, model, kata).
# ---------------------------------------------------------------------

CSV_HEADER="kata,workflow,model,thinking,run_id,exit_code,exit_reason,rate_limited,duration_seconds,total_tokens,context_utilization_pct,cycle_count,avg_cycle_seconds,avg_red_seconds,avg_green_seconds,avg_refactor_seconds,refactorings_applied,predictions_correct,predictions_total,tests_passed_immediately,tests_passing,tests_total,todos_remaining,lines_of_code,test_lines,code_mass,coverage_statements_pct,coverage_branches_pct,cc_loc,cc_functions,cc_longest_function,cc_avg_loc_per_function,cc_imports,smell_total,smell_complexity,smell_duplication,smell_magic_numbers,smell_code_quality"

echo "$CSV_HEADER" > "$CSV"

# Build a jq filter producing one CSV line per metrics.json.
# Use `// ""` for missing scalars so empty cells stay empty (not "null").
JQ_ROW='[
    .kata,
    .workflow,
    .model,
    (.thinking // "" | tostring),
    $run_id,
    (.run_status.exit_code // ""),
    (.run_status.exit_reason // ""),
    (.run_status.rate_limited // false | tostring),
    (.duration_seconds // ""),
    (.summary_metrics.total_tokens // ""),
    (.summary_metrics.context_utilization_pct // ""),
    (.summary_metrics.cycle_count // ""),
    (.summary_metrics.avg_cycle_seconds // ""),
    (.summary_metrics.avg_red_seconds // ""),
    (.summary_metrics.avg_green_seconds // ""),
    (.summary_metrics.avg_refactor_seconds // ""),
    (.summary_metrics.refactorings_applied // ""),
    (.summary_metrics.predictions_correct // ""),
    (.summary_metrics.predictions_total // ""),
    (.summary_metrics.tests_passed_immediately // ""),
    (if .final_metrics.tests_passing == null then "" else (.final_metrics.tests_passing | tostring) end),
    (.final_metrics.tests_total // ""),
    (.final_metrics.todos_remaining // ""),
    (.final_metrics.lines_of_code // ""),
    (.final_metrics.test_lines // ""),
    (.final_metrics.code_mass // ""),
    (.coverage.statements_pct // ""),
    (.coverage.branches_pct // ""),
    (.clean_code.loc // ""),
    (.clean_code.functions // ""),
    (.clean_code.longest_function // ""),
    (.clean_code.avg_loc_per_function // ""),
    (.clean_code.imports // ""),
    (.code_smells.total // ""),
    (.code_smells.complexity // ""),
    (.code_smells.duplication // ""),
    (.code_smells.magic_numbers // ""),
    (.code_smells.code_quality // "")
] | @csv'

for m in "${matched_metrics_files[@]}"; do
    run_id=$(basename "$(dirname "$m")")
    jq -r --arg run_id "$run_id" "$JQ_ROW" "$m" >> "$CSV"
done

echo "CSV: $CSV ($(($(wc -l < "$CSV") - 1)) data rows)" >&2

# ---------------------------------------------------------------------
# Step 3: build summary.md with key tables.
# ---------------------------------------------------------------------

PLAN_DESC=$(jq -r '.description // ""' "$PLAN_FILE")
PLAN_TOTAL=$(jq '.runs | length' "$PLAN_FILE")
RUN_COUNT=${#matched_metrics_files[@]}

{
    echo "# Aggregation: $PLAN_NAME"
    echo
    echo "_${PLAN_DESC}_"
    echo
    echo "Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo
    echo "Plan triples: $PLAN_TOTAL · matched runs: $RUN_COUNT"
    echo
    echo "## Run status overview"
    echo
    echo '| metric | count |'
    echo '|---|---|'
} > "$MD"

# Status counts via awk over the CSV (skip header).
awk -F',' '
function unq(s) {
    if (length(s) >= 2 && substr(s,1,1) == "\"" && substr(s,length(s),1) == "\"") {
        return substr(s, 2, length(s)-2)
    }
    return s
}
NR>1 {
    total++
    if ($6 == 0) green++
    else nongreen++
    if (unq($8) == "true") rl++
    tp_v = unq($21)
    if (tp_v == "true") tp++
    else if (tp_v == "false") tf++
    else tn++
}
END {
    printf "| total runs | %d |\n", total
    printf "| exit_code=0 | %d |\n", green
    printf "| exit_code≠0 | %d |\n", nongreen
    printf "| rate_limited=true | %d |\n", rl
    printf "| tests_passing=true | %d |\n", tp
    printf "| tests_passing=false | %d |\n", tf
    printf "| tests_passing missing | %d |\n", tn
}' "$CSV" >> "$MD"

# ---------------------------------------------------------------------
# Pivot helpers via awk.
# Columns (1-indexed):
#   1 kata, 2 workflow, 3 model, 4 thinking, 5 run_id,
#   6 exit_code, 7 exit_reason, 8 rate_limited,
#   9 duration_seconds, 10 total_tokens, 11 context_utilization_pct,
#  12 cycle_count, ...
#  21 tests_passing, 22 tests_total, 23 todos_remaining,
#  24 lines_of_code, 25 test_lines, 26 code_mass,
#  27 coverage_stmt, 28 coverage_branch,
#  29 cc_loc, 30 cc_functions, 31 cc_longest, 32 cc_avg_loc, 33 cc_imports,
#  34 smell_total, 35 smell_complexity, 36 smell_dup, 37 smell_magic, 38 smell_quality
# ---------------------------------------------------------------------

# avg helper: sums numeric column, divides by count of non-empty rows.
# Optional 5th arg filter_kata restricts rows to that kata (col 1).
# Optional 6th arg heading_level overrides the default "##" heading.
avg_pivot() {
    local title="$1" group_col1="$2" group_col2="$3" value_col="$4"
    local filter_kata="${5:-}" heading="${6:-##}"
    local col1_name col2_name
    col1_name=$(head -1 "$CSV" | awk -F',' -v c="$group_col1" '{print $c}')
    col2_name=$(head -1 "$CSV" | awk -F',' -v c="$group_col2" '{print $c}')
    {
        echo
        echo "$heading $title"
        echo
        echo "| $col1_name | $col2_name | n | avg | min | max |"
        echo "|---|---|---:|---:|---:|---:|"
    } >> "$MD"

    awk -F',' -v g1="$group_col1" -v g2="$group_col2" -v v="$value_col" -v fk="$filter_kata" '
    function unq(s) {
        if (length(s) >= 2 && substr(s,1,1) == "\"" && substr(s,length(s),1) == "\"") {
            return substr(s, 2, length(s)-2)
        }
        return s
    }
    NR>1 && $v != "" {
        if (fk != "" && unq($1) != fk) next
        key = unq($g1) "\t" unq($g2)
        val = $v + 0
        n[key]++
        sum[key] += val
        if (!(key in min) || val < min[key]) min[key] = val
        if (!(key in max) || val > max[key]) max[key] = val
    }
    END {
        for (k in n) {
            split(k, a, "\t")
            printf "| %s | %s | %d | %.1f | %.1f | %.1f |\n", a[1], a[2], n[k], sum[k]/n[k], min[k], max[k]
        }
    }' "$CSV" | sort >> "$MD"
}

# rate helper: percentage of rows where value_col equals match_value, by group.
# Optional 6th arg filter_kata restricts rows to that kata (col 1).
# Optional 7th arg heading_level overrides the default "##" heading.
rate_pivot() {
    local title="$1" group_col1="$2" group_col2="$3" value_col="$4" match_value="$5"
    local filter_kata="${6:-}" heading="${7:-##}"
    local col1_name col2_name
    col1_name=$(head -1 "$CSV" | awk -F',' -v c="$group_col1" '{print $c}')
    col2_name=$(head -1 "$CSV" | awk -F',' -v c="$group_col2" '{print $c}')
    {
        echo
        echo "$heading $title"
        echo
        echo "| $col1_name | $col2_name | n | match | rate |"
        echo "|---|---|---:|---:|---:|"
    } >> "$MD"

    awk -F',' -v g1="$group_col1" -v g2="$group_col2" -v v="$value_col" -v mv="$match_value" -v fk="$filter_kata" '
    function unq(s) {
        # strip surrounding double quotes if present (@csv-quoted strings)
        if (length(s) >= 2 && substr(s,1,1) == "\"" && substr(s,length(s),1) == "\"") {
            return substr(s, 2, length(s)-2)
        }
        return s
    }
    NR>1 {
        if (fk != "" && unq($1) != fk) next
        key = unq($g1) "\t" unq($g2)
        n[key]++
        if (unq($v) == mv) m[key]++
    }
    END {
        for (k in n) {
            split(k, a, "\t")
            mc = (k in m) ? m[k] : 0
            printf "| %s | %s | %d | %d | %.0f%% |\n", a[1], a[2], n[k], mc, 100*mc/n[k]
        }
    }' "$CSV" | sort >> "$MD"
}

# ratio helper: aggregate sum(numerator)/sum(denominator) per (g1,g2) group.
# Useful for predictions_correct/predictions_total, where the ratio is more
# informative than per-run averages.
# Optional 6th arg filter_kata restricts rows to that kata (col 1).
# Optional 7th arg heading_level overrides the default "##" heading.
ratio_pivot() {
    local title="$1" group_col1="$2" group_col2="$3" num_col="$4" den_col="$5"
    local filter_kata="${6:-}" heading="${7:-##}"
    local col1_name col2_name num_name den_name
    col1_name=$(head -1 "$CSV" | awk -F',' -v c="$group_col1" '{print $c}')
    col2_name=$(head -1 "$CSV" | awk -F',' -v c="$group_col2" '{print $c}')
    num_name=$(head -1 "$CSV" | awk -F',' -v c="$num_col" '{print $c}')
    den_name=$(head -1 "$CSV" | awk -F',' -v c="$den_col" '{print $c}')
    {
        echo
        echo "$heading $title"
        echo
        echo "| $col1_name | $col2_name | n | $num_name | $den_name | rate |"
        echo "|---|---|---:|---:|---:|---:|"
    } >> "$MD"

    awk -F',' -v g1="$group_col1" -v g2="$group_col2" -v nc="$num_col" -v dc="$den_col" -v fk="$filter_kata" '
    function unq(s) {
        if (length(s) >= 2 && substr(s,1,1) == "\"" && substr(s,length(s),1) == "\"") {
            return substr(s, 2, length(s)-2)
        }
        return s
    }
    NR>1 {
        if (fk != "" && unq($1) != fk) next
        if ($nc == "" || $dc == "") next
        key = unq($g1) "\t" unq($g2)
        n[key]++
        sn[key] += $nc + 0
        sd[key] += $dc + 0
    }
    END {
        for (k in n) {
            split(k, a, "\t")
            rate = (sd[k] > 0) ? 100*sn[k]/sd[k] : 0
            printf "| %s | %s | %d | %d | %d | %.0f%% |\n", a[1], a[2], n[k], sn[k], sd[k], rate
        }
    }' "$CSV" | sort >> "$MD"
}

# ---------------------------------------------------------------------
# Per-kata blocks: every workflow×model pivot below scopes to ONE kata.
# Cross-kata aggregation is appended at the end as a sanity-check only.
# ---------------------------------------------------------------------

# Discover katas present in the CSV (skip header, deduplicate, sort).
KATAS=$(awk -F',' 'NR>1 {
    s=$1
    if (length(s) >= 2 && substr(s,1,1) == "\"" && substr(s,length(s),1) == "\"") {
        s = substr(s, 2, length(s)-2)
    }
    print s
}' "$CSV" | sort -u)

for kata in $KATAS; do
    {
        echo
        echo "## Kata: $kata"
    } >> "$MD"

    # --- Core metrics ---
    rate_pivot   "Core metrics — Tests passing rate (workflow × model)"      2 3 21 "true"  "$kata" "###"
    avg_pivot    "Core metrics — Duration seconds (workflow × model)"        2 3 9   "$kata" "###"
    avg_pivot    "Core metrics — Total tokens (workflow × model)"             2 3 10  "$kata" "###"
    avg_pivot    "Core metrics — Context utilization % (workflow × model)"    2 3 11  "$kata" "###"
    avg_pivot    "Core metrics — Lines of code (workflow × model)"           2 3 24  "$kata" "###"
    avg_pivot    "Core metrics — Code mass (workflow × model)"               2 3 26  "$kata" "###"
    avg_pivot    "Core metrics — Test lines (workflow × model)"              2 3 25  "$kata" "###"
    avg_pivot    "Core metrics — Tests total (workflow × model)"             2 3 22  "$kata" "###"

    # --- TDD discipline ---
    avg_pivot    "TDD discipline — Cycle count (workflow × model)"           2 3 12  "$kata" "###"
    avg_pivot    "TDD discipline — Refactorings applied (workflow × model)"  2 3 17  "$kata" "###"
    ratio_pivot  "TDD discipline — Predictions correct / total (workflow × model)" 2 3 18 19 "$kata" "###"
    avg_pivot    "TDD discipline — Tests passed immediately (workflow × model)" 2 3 20 "$kata" "###"
    avg_pivot    "TDD discipline — Avg red seconds (workflow × model)"       2 3 14  "$kata" "###"
    avg_pivot    "TDD discipline — Avg green seconds (workflow × model)"     2 3 15  "$kata" "###"
    avg_pivot    "TDD discipline — Avg refactor seconds (workflow × model)"  2 3 16  "$kata" "###"

    # --- Code quality ---
    avg_pivot    "Code quality — cc_loc (workflow × model)"                  2 3 29  "$kata" "###"
    avg_pivot    "Code quality — cc_functions (workflow × model)"            2 3 30  "$kata" "###"
    avg_pivot    "Code quality — cc_longest_function (workflow × model)"     2 3 31  "$kata" "###"
    avg_pivot    "Code quality — cc_avg_loc_per_function (workflow × model)" 2 3 32  "$kata" "###"
    avg_pivot    "Code quality — smell_total (workflow × model)"             2 3 34  "$kata" "###"
    avg_pivot    "Code quality — smell_magic_numbers (workflow × model)"     2 3 37  "$kata" "###"
    avg_pivot    "Code quality — smell_complexity (workflow × model)"        2 3 35  "$kata" "###"

    # --- Coverage ---
    avg_pivot    "Coverage — statements % (workflow × model)"                2 3 27  "$kata" "###"
    avg_pivot    "Coverage — branches % (workflow × model)"                  2 3 28  "$kata" "###"
done

# ---------------------------------------------------------------------
# Cross-kata sanity-check appendix.
# These tables average over katas with very different complexity (LoC
# 3–40+) and should NOT be used for workflow×model comparisons.
# ---------------------------------------------------------------------
{
    echo
    echo "## Cross-kata averages (sanity check only — do NOT compare across katas with different complexity)"
    echo
    echo "> The tables below mix katas of very different size and structure"
    echo "> (string-calculator: ~3 LoC, no smell room; game-of-life: ~40 LoC,"
    echo "> high smell room). Means here can swing wildly when the kata mix"
    echo "> changes. For workflow×model comparisons, use the per-kata blocks"
    echo "> above."
} >> "$MD"

rate_pivot   "Tests passing rate (workflow × model, all katas)"      2 3 21 "true"
avg_pivot    "Duration seconds (workflow × model, all katas)"        2 3 9
avg_pivot    "Lines of code (workflow × model, all katas)"           2 3 24
avg_pivot    "Code mass (workflow × model, all katas)"               2 3 26
avg_pivot    "Coverage statements % (workflow × model, all katas)"   2 3 27
avg_pivot    "Coverage branches % (workflow × model, all katas)"     2 3 28
avg_pivot    "Test lines (workflow × model, all katas)"              2 3 25
avg_pivot    "Tests total (workflow × model, all katas)"             2 3 22
avg_pivot    "Todos remaining (workflow × model, all katas)"         2 3 23

# Per-kata breakdown (workflow × kata, average across models)
rate_pivot   "Tests passing rate (workflow × kata, all models)"      2 1 21 "true"
avg_pivot    "Duration seconds (workflow × kata, all models)"        2 1 9
avg_pivot    "Lines of code (workflow × kata, all models)"           2 1 24

{
    echo
    echo "## Files"
    echo
    echo "- CSV: \`$CSV\`"
    echo "- Source plan: \`$PLAN_FILE\`"
    echo "- Run dirs: \`$RUNS_DIR/*\`"
} >> "$MD"

echo "Markdown: $MD" >&2
echo "Done." >&2
