#!/bin/bash

# TDD Experiment Analyzer
# Analyzes completed runs and generates comparison reports

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

EXPERIMENTS_DIR="$(cd "$(dirname "$0")" && pwd)"
RUNS_DIR="$EXPERIMENTS_DIR/runs"

print_header() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  TDD Experiment Analyzer${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
}

# Find implementation file (supports multiple katas)
find_impl_file() {
    local run_dir=$1
    local impl_file=""

    # Try common patterns
    for pattern in "string-calculator" "game-of-life" "game_of_life" "gameOfLife"; do
        if [ -f "$run_dir/src/${pattern}.ts" ]; then
            impl_file="$run_dir/src/${pattern}.ts"
            break
        fi
    done

    # Fallback: find any .ts file that's not a spec
    if [ -z "$impl_file" ]; then
        impl_file=$(find "$run_dir/src" -name "*.ts" ! -name "*.spec.ts" 2>/dev/null | head -1)
    fi

    echo "$impl_file"
}

# Find test file
find_test_file() {
    local run_dir=$1
    local test_file=""

    # Try common patterns
    for pattern in "string-calculator" "game-of-life" "game_of_life" "gameOfLife"; do
        if [ -f "$run_dir/src/${pattern}.spec.ts" ]; then
            test_file="$run_dir/src/${pattern}.spec.ts"
            break
        fi
    done

    # Fallback: find any spec file
    if [ -z "$test_file" ]; then
        test_file=$(find "$run_dir/src" -name "*.spec.ts" 2>/dev/null | head -1)
    fi

    echo "$test_file"
}

# Extract metrics from transcript-metrics.json (post-hoc transcript analysis).
#
# Pipe-separated output schema (kept stable so downstream code does not break):
#   total_tokens | context_util | cycle_count | avg_cycle | avg_red | avg_green |
#   avg_refactor | predictions_correct | predictions_total | prediction_pct |
#   refactorings | final_mass | tests_passed_immediately
#
# Phase-derivable fields (avg_*, refactorings, tests_passed_immediately) are
# only meaningful for v4/v5 (TDD with subagents/skills); for v1/v2/v3 they are 0.
# `predictions_*` is no longer captured (was self-report only) and stays 0.
extract_transcript_metrics() {
    local metrics_file=$1

    if [ ! -f "$metrics_file" ] || ! command -v jq &> /dev/null; then
        echo "0|0|0|0|0|0|0|0|0|0|0|0|0"
        return
    fi

    local total_tokens context_util cycle_count
    total_tokens=$(jq -r '.total_tokens.total // 0' "$metrics_file")
    context_util=$(jq -r '.context_utilization_pct // 0' "$metrics_file")
    cycle_count=$(jq -r '.cycle_count // 0' "$metrics_file")

    local avg_red avg_green avg_refactor avg_cycle
    avg_red=$(jq -r '.phase_summary.averages.red.avg_duration_seconds // 0' "$metrics_file")
    avg_green=$(jq -r '.phase_summary.averages.green.avg_duration_seconds // 0' "$metrics_file")
    avg_refactor=$(jq -r '.phase_summary.averages.refactor.avg_duration_seconds // 0' "$metrics_file")
    # avg_cycle = sum of avg_red + avg_green + avg_refactor (rough)
    avg_cycle=$(awk -v r="$avg_red" -v g="$avg_green" -v f="$avg_refactor" 'BEGIN { printf "%.2f", r+g+f }')

    local refactorings tests_passed_immediately
    refactorings=$(jq -r '.phase_summary.refactorings_applied // 0' "$metrics_file")
    tests_passed_immediately=$(jq -r '.phase_summary.tests_passed_immediately // 0' "$metrics_file")

    echo "${total_tokens}|${context_util}|${cycle_count}|${avg_cycle}|${avg_red}|${avg_green}|${avg_refactor}|0|0|0|${refactorings}|0|${tests_passed_immediately}"
}

analyze_single_run() {
    local run_dir=$1
    local save_report=${2:-false}

    if [ ! -d "$run_dir" ]; then
        echo -e "${RED}Run directory not found: $run_dir${NC}"
        exit 1
    fi

    local run_name=$(basename "$run_dir")
    local report_file="$run_dir/analysis-report.md"
    local report_content=""

    echo -e "\n${CYAN}Analyzing: $run_name${NC}"
    echo -e "${CYAN}─────────────────────────────────────────────────${NC}"

    # Start building report
    report_content="# Analysis Report: $run_name\n\n"
    report_content+="Generated: $(date -Iseconds)\n\n"

    # Basic info from metrics.json
    local kata=""
    local workflow=""
    local duration=""
    local started_at=""
    local ended_at=""

    if [ -f "$run_dir/metrics.json" ]; then
        if command -v jq &> /dev/null; then
            kata=$(jq -r '.kata' "$run_dir/metrics.json")
            workflow=$(jq -r '.workflow' "$run_dir/metrics.json")
            duration=$(jq -r '.duration_seconds // "N/A"' "$run_dir/metrics.json")
            started_at=$(jq -r '.started_at // "N/A"' "$run_dir/metrics.json")
            ended_at=$(jq -r '.ended_at // "N/A"' "$run_dir/metrics.json")

            local model=$(jq -r '.model // "unknown"' "$run_dir/metrics.json")
            local thinking=$(jq -r '.thinking // "unknown"' "$run_dir/metrics.json")

            echo -e "${YELLOW}Kata:${NC} $kata"
            echo -e "${YELLOW}Workflow:${NC} $workflow"
            echo -e "${YELLOW}Model:${NC} $model (thinking: $thinking)"
            echo -e "${YELLOW}Duration:${NC} ${duration}s"

            report_content+="## Configuration\n\n"
            report_content+="| Property | Value |\n"
            report_content+="|----------|-------|\n"
            report_content+="| Kata | $kata |\n"
            report_content+="| Workflow | $workflow |\n"
            report_content+="| Model | $model |\n"
            report_content+="| Thinking | $thinking |\n"
            report_content+="| Duration | ${duration}s |\n"
            report_content+="| Started | $started_at |\n"
            report_content+="| Ended | $ended_at |\n\n"
        fi
    fi

    # Find implementation and test files
    local impl_file=$(find_impl_file "$run_dir")
    local test_file=$(find_test_file "$run_dir")

    # Code metrics
    echo -e "\n${YELLOW}Code Metrics:${NC}"
    report_content+="## Code Metrics\n\n"

    local impl_loc=0
    local test_loc=0
    local test_count=0
    local todo_count=0

    # Implementation file
    if [ -n "$impl_file" ] && [ -f "$impl_file" ]; then
        impl_loc=$(wc -l < "$impl_file" | tr -d '[:space:]')
        echo -e "  Implementation LOC: $impl_loc"
        echo -e "  File: $(basename "$impl_file")"
        report_content+="- **Implementation file**: $(basename "$impl_file")\n"
        report_content+="- **Implementation LOC**: $impl_loc\n"
    else
        echo -e "  Implementation: ${RED}Not found${NC}"
        report_content+="- **Implementation**: Not found\n"
    fi

    # Test file
    if [ -n "$test_file" ] && [ -f "$test_file" ]; then
        test_loc=$(wc -l < "$test_file" | tr -d '[:space:]')
        test_count=$(grep -c "it(" "$test_file" 2>/dev/null | tr -d '[:space:]' || echo "0")
        todo_count=$(grep -c "it.todo" "$test_file" 2>/dev/null | tr -d '[:space:]' || echo "0")

        echo -e "  Test file LOC: $test_loc"
        echo -e "  Active tests: $test_count"
        echo -e "  Remaining todos: $todo_count"

        report_content+="- **Test file**: $(basename "$test_file")\n"
        report_content+="- **Test file LOC**: $test_loc\n"
        report_content+="- **Active tests**: $test_count\n"
        report_content+="- **Remaining todos**: $todo_count\n\n"
    else
        echo -e "  Tests: ${RED}Not found${NC}"
        report_content+="- **Tests**: Not found\n\n"
    fi

    # Run tests if possible
    echo -e "\n${YELLOW}Test Results:${NC}"
    report_content+="## Test Results\n\n"

    local test_output=""
    local tests_passed=false

    # Coverage metrics (statements and branches only)
    local cov_statements=0
    local cov_branches=0

    if [ -f "$run_dir/package.json" ] && [ -d "$run_dir/node_modules" ]; then
        test_output=$(cd "$run_dir" && pnpm test 2>&1) || true
        echo "$test_output"

        # Check if tests passed
        if echo "$test_output" | grep -q "passed"; then
            tests_passed=true
            local passed_count=$(echo "$test_output" | grep -oE "[0-9]+ passed" | head -1)
            report_content+="**Status**: ✅ All tests passing ($passed_count)\n\n"
        else
            report_content+="**Status**: ❌ Tests failed or not runnable\n\n"
        fi

        report_content+="\`\`\`\n$test_output\n\`\`\`\n\n"

        # Run coverage if tests passed
        if [ "$tests_passed" = true ]; then
            echo -e "\n${YELLOW}Running Coverage Analysis...${NC}"
            (cd "$run_dir" && pnpm test:coverage 2>&1) > /dev/null || true

            # Extract coverage from json-summary (statements and branches only)
            if [ -f "$run_dir/coverage/coverage-summary.json" ] && command -v jq &> /dev/null; then
                cov_statements=$(jq -r '.total.statements.pct // 0' "$run_dir/coverage/coverage-summary.json" 2>/dev/null | cut -d'.' -f1)
                cov_branches=$(jq -r '.total.branches.pct // 0' "$run_dir/coverage/coverage-summary.json" 2>/dev/null | cut -d'.' -f1)

                # Ensure valid integers
                [[ "$cov_statements" =~ ^[0-9]+$ ]] || cov_statements=0
                [[ "$cov_branches" =~ ^[0-9]+$ ]] || cov_branches=0

                echo -e "  ${CYAN}Coverage:${NC}"
                echo -e "    Statements: ${cov_statements}%"
                echo -e "    Branches: ${cov_branches}%"

                report_content+="## Coverage\n\n"
                report_content+="| Metric | Coverage |\n"
                report_content+="|--------|----------|\n"
                report_content+="| Statements | ${cov_statements}% |\n"
                report_content+="| Branches | ${cov_branches}% |\n\n"
            else
                echo -e "  ${YELLOW}Coverage data not available${NC}"
            fi
        fi
    else
        echo -e "  ${YELLOW}Run 'pnpm install' in $run_dir to enable test execution${NC}"
        report_content+="Tests not runnable (dependencies not installed)\n\n"
    fi

    # Calculate APP mass if implementation exists
    local total_mass=0
    local constants=0
    local invocations=0
    local conditionals=0
    local loops=0
    local assignments=0

    if [ -n "$impl_file" ] && [ -f "$impl_file" ]; then
        echo -e "\n${YELLOW}APP Mass Estimation:${NC}"
        report_content+="## APP Mass Estimation\n\n"

        constants=$(grep -oE '\b[0-9]+\b|"[^"]*"|'\''[^'\'']*'\''' "$impl_file" 2>/dev/null | wc -l | tr -d '[:space:]')
        invocations=$(grep -oE '\w+\s*\(' "$impl_file" 2>/dev/null | wc -l | tr -d '[:space:]')
        conditionals=$(grep -cE '\bif\b|\bswitch\b|\?.*:' "$impl_file" 2>/dev/null | tr -d '[:space:]')
        loops=$(grep -cE '\bfor\b|\bwhile\b|\.map\(|\.reduce\(|\.forEach\(' "$impl_file" 2>/dev/null | tr -d '[:space:]')
        assignments=$(grep -cE '[^=!<>]=[^=]|\+\+|--' "$impl_file" 2>/dev/null | tr -d '[:space:]')

        # Ensure all variables are valid integers (default to 0 if empty or non-numeric)
        [[ "$constants" =~ ^[0-9]+$ ]] || constants=0
        [[ "$invocations" =~ ^[0-9]+$ ]] || invocations=0
        [[ "$conditionals" =~ ^[0-9]+$ ]] || conditionals=0
        [[ "$loops" =~ ^[0-9]+$ ]] || loops=0
        [[ "$assignments" =~ ^[0-9]+$ ]] || assignments=0

        total_mass=$((constants * 1 + invocations * 2 + conditionals * 4 + loops * 5 + assignments * 6))

        echo -e "  Constants: $constants (×1 = $constants)"
        echo -e "  Invocations: $invocations (×2 = $((invocations * 2)))"
        echo -e "  Conditionals: $conditionals (×4 = $((conditionals * 4)))"
        echo -e "  Loops: $loops (×5 = $((loops * 5)))"
        echo -e "  Assignments: $assignments (×6 = $((assignments * 6)))"
        echo -e "  ${GREEN}Estimated Total Mass: $total_mass${NC}"

        report_content+="| Component | Count | Weight | Score |\n"
        report_content+="|-----------|-------|--------|-------|\n"
        report_content+="| Constants | $constants | ×1 | $constants |\n"
        report_content+="| Invocations | $invocations | ×2 | $((invocations * 2)) |\n"
        report_content+="| Conditionals | $conditionals | ×4 | $((conditionals * 4)) |\n"
        report_content+="| Loops | $loops | ×5 | $((loops * 5)) |\n"
        report_content+="| Assignments | $assignments | ×6 | $((assignments * 6)) |\n"
        report_content+="| **Total Mass** | | | **$total_mass** |\n\n"
    fi

    # Clean Code Metrics
    local cc_loc=0
    local cc_functions=0
    local cc_longest_func=0
    local cc_avg_loc_func=0
    local cc_imports=0

    if [ -n "$impl_file" ] && [ -f "$impl_file" ]; then
        echo -e "\n${YELLOW}Clean Code Metrics:${NC}"
        report_content+="## Clean Code Metrics\n\n"

        # LOC (non-blank, non-comment lines)
        cc_loc=$(grep -vE '^\s*$|^\s*//|^\s*/\*|\^\s*\*' "$impl_file" 2>/dev/null | wc -l | tr -d '[:space:]')

        # Count functions (function declarations, arrow functions, methods)
        cc_functions=$(grep -cE '^\s*(export\s+)?(async\s+)?function\s+\w+|^\s*(export\s+)?(const|let|var)\s+\w+\s*=\s*(async\s+)?\(' "$impl_file" 2>/dev/null) || cc_functions=0

        # Count imports
        cc_imports=$(grep -cE '^\s*import\s+' "$impl_file" 2>/dev/null) || cc_imports=0

        # Calculate longest function and avg LOC/function using awk
        # This counts lines between function starts and closing braces at the same level
        local func_analysis
        func_analysis=$(awk '
            /^\s*(export\s+)?(async\s+)?function\s+\w+|^\s*(export\s+)?(const|let|var)\s+\w+\s*=\s*(async\s+)?\(/ {
                if (in_func && func_lines > 0) {
                    total_lines += func_lines
                    func_count++
                    if (func_lines > max_lines) max_lines = func_lines
                }
                in_func = 1
                func_lines = 0
                brace_count = 0
            }
            in_func {
                func_lines++
                # Count braces to detect function end
                gsub(/[^{}]/, "")
                for (i = 1; i <= length($0); i++) {
                    c = substr($0, i, 1)
                    if (c == "{") brace_count++
                    else if (c == "}") brace_count--
                }
                if (brace_count <= 0 && func_lines > 1) {
                    total_lines += func_lines
                    func_count++
                    if (func_lines > max_lines) max_lines = func_lines
                    in_func = 0
                    func_lines = 0
                }
            }
            END {
                if (in_func && func_lines > 0) {
                    total_lines += func_lines
                    func_count++
                    if (func_lines > max_lines) max_lines = func_lines
                }
                if (func_count > 0) {
                    avg = int(total_lines / func_count)
                } else {
                    avg = 0
                }
                print func_count " " max_lines " " avg
            }
        ' "$impl_file" 2>/dev/null)

        if [ -n "$func_analysis" ]; then
            cc_functions=$(echo "$func_analysis" | cut -d' ' -f1)
            cc_longest_func=$(echo "$func_analysis" | cut -d' ' -f2)
            cc_avg_loc_func=$(echo "$func_analysis" | cut -d' ' -f3)
        fi

        # Ensure valid integers
        [[ "$cc_loc" =~ ^[0-9]+$ ]] || cc_loc=0
        [[ "$cc_functions" =~ ^[0-9]+$ ]] || cc_functions=0
        [[ "$cc_longest_func" =~ ^[0-9]+$ ]] || cc_longest_func=0
        [[ "$cc_avg_loc_func" =~ ^[0-9]+$ ]] || cc_avg_loc_func=0
        [[ "$cc_imports" =~ ^[0-9]+$ ]] || cc_imports=0

        echo -e "  ${CYAN}LOC (non-blank):${NC} $cc_loc"
        echo -e "  ${CYAN}Functions:${NC} $cc_functions"
        echo -e "  ${CYAN}Longest Function:${NC} $cc_longest_func lines"
        echo -e "  ${CYAN}Avg LOC/Function:${NC} $cc_avg_loc_func"
        echo -e "  ${CYAN}Imports:${NC} $cc_imports"

        report_content+="| Metric | Value |\n"
        report_content+="|--------|-------|\n"
        report_content+="| LOC (non-blank) | $cc_loc |\n"
        report_content+="| Functions | $cc_functions |\n"
        report_content+="| Longest Function | $cc_longest_func lines |\n"
        report_content+="| Avg LOC/Function | $cc_avg_loc_func |\n"
        report_content+="| Imports | $cc_imports |\n\n"
    fi

    # Code Smell Detection using ESLint
    local smell_total=0
    local smell_complexity=0
    local smell_duplication=0
    local smell_magic_numbers=0
    local smell_code_quality=0

    if [ -n "$impl_file" ] && [ -f "$impl_file" ] && [ -f "$run_dir/eslint.config.mjs" ] && [ -d "$run_dir/node_modules" ]; then
        echo -e "\n${YELLOW}Code Smell Detection:${NC}"
        report_content+="## Code Smells\n\n"

        # Run ESLint and capture JSON output
        local eslint_output
        eslint_output=$(cd "$run_dir" && npx eslint src/*.ts --ignore-pattern "*.spec.ts" --config eslint.config.mjs --format json 2>/dev/null) || true

        if [ -n "$eslint_output" ] && command -v jq &> /dev/null; then
            # Parse ESLint JSON output to count violations by rule category
            local all_rules
            all_rules=$(echo "$eslint_output" | jq -r '.[].messages[].ruleId // empty' 2>/dev/null)

            if [ -n "$all_rules" ]; then
                # Count by category (grep -c returns 1 on no match, so use || true)
                smell_complexity=$(echo "$all_rules" | grep -cE 'cognitive-complexity|max-depth|max-lines-per-function|max-params|no-nested-switch' 2>/dev/null) || smell_complexity=0
                smell_duplication=$(echo "$all_rules" | grep -cE 'no-duplicate-string|no-duplicated-branches|no-identical-functions' 2>/dev/null) || smell_duplication=0
                smell_magic_numbers=$(echo "$all_rules" | grep -cE 'no-magic-numbers' 2>/dev/null) || smell_magic_numbers=0
                smell_code_quality=$(echo "$all_rules" | grep -cE 'no-collapsible-if|no-redundant-jump|no-useless-catch|prefer-immediate-return|prefer-single-boolean-return|no-redundant-boolean|no-gratuitous-expressions|no-unused-collection|no-unreachable' 2>/dev/null) || smell_code_quality=0
            fi

            # Calculate total (ensure values are integers first)
            [[ "$smell_complexity" =~ ^[0-9]+$ ]] || smell_complexity=0
            [[ "$smell_duplication" =~ ^[0-9]+$ ]] || smell_duplication=0
            [[ "$smell_magic_numbers" =~ ^[0-9]+$ ]] || smell_magic_numbers=0
            [[ "$smell_code_quality" =~ ^[0-9]+$ ]] || smell_code_quality=0
            smell_total=$((smell_complexity + smell_duplication + smell_magic_numbers + smell_code_quality))

            if [ $smell_total -eq 0 ]; then
                echo -e "  ${GREEN}No code smells detected${NC}"
            else
                echo -e "  ${CYAN}Complexity:${NC} $smell_complexity"
                echo -e "  ${CYAN}Duplication:${NC} $smell_duplication"
                echo -e "  ${CYAN}Magic Numbers:${NC} $smell_magic_numbers"
                echo -e "  ${CYAN}Code Quality:${NC} $smell_code_quality"
                echo -e "  ${YELLOW}Total Smells: $smell_total${NC}"
            fi

            report_content+="| Category | Count |\n"
            report_content+="|----------|-------|\n"
            report_content+="| Complexity | $smell_complexity |\n"
            report_content+="| Duplication | $smell_duplication |\n"
            report_content+="| Magic Numbers | $smell_magic_numbers |\n"
            report_content+="| Code Quality | $smell_code_quality |\n"
            report_content+="| **Total** | **$smell_total** |\n\n"
        else
            echo -e "  ${YELLOW}ESLint analysis not available${NC}"
        fi
    fi

    # Extract metrics from transcript-metrics.json (post-hoc transcript analysis).
    # Variables keep the `summary_*` prefix for downstream stability.
    local summary_metrics=""
    local summary_total_tokens=0
    local summary_context_util=0
    local summary_cycle_count=0
    local summary_avg_cycle=0
    local summary_avg_red=0
    local summary_avg_green=0
    local summary_avg_refactor=0
    local summary_pred_correct=0
    local summary_pred_total=0
    local summary_pred_pct=0
    local summary_refactorings=0
    local summary_final_mass=0
    local summary_tests_passed_immediately=0

    # Run transcript analyzer to (re)generate transcript-metrics.json
    if [ -f "$run_dir/transcript.jsonl" ]; then
        local analyzer="$EXPERIMENTS_DIR/analyze_transcript.py"
        if [ -x "$analyzer" ] || [ -f "$analyzer" ]; then
            python3 "$analyzer" "$run_dir" >/dev/null 2>&1 || \
                echo -e "${YELLOW}analyze_transcript.py failed for $run_dir${NC}"
        fi
    fi

    if [ -f "$run_dir/transcript-metrics.json" ]; then
        echo -e "\n${YELLOW}Transcript Metrics:${NC}"
        report_content+="## Transcript Metrics\n\n"

        summary_metrics=$(extract_transcript_metrics "$run_dir/transcript-metrics.json")

        # Parse the pipe-separated values
        summary_total_tokens=$(echo "$summary_metrics" | cut -d'|' -f1)
        summary_context_util=$(echo "$summary_metrics" | cut -d'|' -f2)
        summary_cycle_count=$(echo "$summary_metrics" | cut -d'|' -f3)
        summary_avg_cycle=$(echo "$summary_metrics" | cut -d'|' -f4)
        summary_avg_red=$(echo "$summary_metrics" | cut -d'|' -f5)
        summary_avg_green=$(echo "$summary_metrics" | cut -d'|' -f6)
        summary_avg_refactor=$(echo "$summary_metrics" | cut -d'|' -f7)
        summary_pred_correct=$(echo "$summary_metrics" | cut -d'|' -f8)
        summary_pred_total=$(echo "$summary_metrics" | cut -d'|' -f9)
        summary_pred_pct=$(echo "$summary_metrics" | cut -d'|' -f10)
        summary_refactorings=$(echo "$summary_metrics" | cut -d'|' -f11)
        summary_final_mass=$(echo "$summary_metrics" | cut -d'|' -f12)
        summary_tests_passed_immediately=$(echo "$summary_metrics" | cut -d'|' -f13)

        # Ensure valid numbers (int for counts, float allowed for averages)
        [[ "$summary_total_tokens" =~ ^[0-9]+$ ]] || summary_total_tokens=0
        [[ "$summary_context_util" =~ ^[0-9]+$ ]] || summary_context_util=0
        [[ "$summary_cycle_count" =~ ^[0-9]+$ ]] || summary_cycle_count=0
        [[ "$summary_refactorings" =~ ^[0-9]+$ ]] || summary_refactorings=0
        [[ "$summary_pred_correct" =~ ^[0-9]+$ ]] || summary_pred_correct=0
        [[ "$summary_pred_total" =~ ^[0-9]+$ ]] || summary_pred_total=0
        [[ "$summary_tests_passed_immediately" =~ ^[0-9]+$ ]] || summary_tests_passed_immediately=0
        [[ "$summary_avg_cycle" =~ ^[0-9]+(\.[0-9]+)?$ ]] || summary_avg_cycle=0
        [[ "$summary_avg_red" =~ ^[0-9]+(\.[0-9]+)?$ ]] || summary_avg_red=0
        [[ "$summary_avg_green" =~ ^[0-9]+(\.[0-9]+)?$ ]] || summary_avg_green=0
        [[ "$summary_avg_refactor" =~ ^[0-9]+(\.[0-9]+)?$ ]] || summary_avg_refactor=0

        # Token Usage
        echo -e "  ${CYAN}Token Usage:${NC}"
        echo -e "    Total tokens: $summary_total_tokens"
        echo -e "    Context utilization: ${summary_context_util}%"

        report_content+="### Token Usage\n\n"
        report_content+="| Metric | Value |\n"
        report_content+="|--------|-------|\n"
        report_content+="| Total Tokens | $summary_total_tokens |\n"
        report_content+="| Context Utilization | ${summary_context_util}% |\n\n"

        # TDD Cycle Metrics
        echo -e "  ${CYAN}TDD Cycles:${NC}"
        echo -e "    Cycle count: $summary_cycle_count"
        echo -e "    Avg cycle time: ${summary_avg_cycle}s"
        echo -e "    Avg Red: ${summary_avg_red}s | Green: ${summary_avg_green}s | Refactor: ${summary_avg_refactor}s"

        report_content+="### TDD Cycle Metrics\n\n"
        report_content+="| Metric | Value |\n"
        report_content+="|--------|-------|\n"
        report_content+="| Cycle Count | $summary_cycle_count |\n"
        report_content+="| Avg Cycle Time | ${summary_avg_cycle}s |\n"
        report_content+="| Avg Red Phase | ${summary_avg_red}s |\n"
        report_content+="| Avg Green Phase | ${summary_avg_green}s |\n"
        report_content+="| Avg Refactor Phase | ${summary_avg_refactor}s |\n\n"

        # Prediction Accuracy
        echo -e "  ${CYAN}Prediction Accuracy:${NC}"
        if [ "$summary_pred_total" -gt 0 ]; then
            echo -e "    Predictions: ${summary_pred_correct}/${summary_pred_total}"
        fi

        report_content+="### Prediction Accuracy (Guessing Game)\n\n"
        report_content+="| Metric | Value |\n"
        report_content+="|--------|-------|\n"
        report_content+="| Predictions Correct | $summary_pred_correct |\n"
        report_content+="| Predictions Total | $summary_pred_total |\n"
        if [ "$summary_pred_total" -gt 0 ]; then
            local calc_pct=$((summary_pred_correct * 100 / summary_pred_total))
            report_content+="| Accuracy | ${calc_pct}% |\n\n"
        else
            report_content+="| Accuracy | N/A |\n\n"
        fi

        # Refactoring Metrics
        echo -e "  ${CYAN}Refactoring:${NC}"
        echo -e "    Refactorings applied: $summary_refactorings"

        report_content+="### Refactoring Metrics\n\n"
        report_content+="| Metric | Value |\n"
        report_content+="|--------|-------|\n"
        report_content+="| Refactorings Applied | $summary_refactorings |\n\n"

        # TDD Discipline
        echo -e "  ${CYAN}TDD Discipline:${NC}"
        echo -e "    Tests passed immediately (no Green needed): $summary_tests_passed_immediately"

        report_content+="### TDD Discipline\n\n"
        report_content+="| Metric | Value |\n"
        report_content+="|--------|-------|\n"
        report_content+="| Tests Passed Immediately | $summary_tests_passed_immediately |\n\n"
    fi

    # Source code lives next to the report in src/; no need to inline it here.

    # Update metrics.json with analysis results
    if [ -f "$run_dir/metrics.json" ] && command -v jq &> /dev/null; then
        # Ensure all values are valid integers, default to 0
        [[ "$impl_loc" =~ ^[0-9]+$ ]] || impl_loc=0
        [[ "$test_loc" =~ ^[0-9]+$ ]] || test_loc=0
        [[ "$test_count" =~ ^[0-9]+$ ]] || test_count=0
        [[ "$todo_count" =~ ^[0-9]+$ ]] || todo_count=0
        [[ "$total_mass" =~ ^[0-9]+$ ]] || total_mass=0
        [[ "$cov_statements" =~ ^[0-9]+$ ]] || cov_statements=0
        [[ "$cov_branches" =~ ^[0-9]+$ ]] || cov_branches=0
        [[ "$smell_total" =~ ^[0-9]+$ ]] || smell_total=0
        [[ "$smell_complexity" =~ ^[0-9]+$ ]] || smell_complexity=0
        [[ "$smell_duplication" =~ ^[0-9]+$ ]] || smell_duplication=0
        [[ "$smell_magic_numbers" =~ ^[0-9]+$ ]] || smell_magic_numbers=0
        [[ "$smell_code_quality" =~ ^[0-9]+$ ]] || smell_code_quality=0
        [[ "$cc_loc" =~ ^[0-9]+$ ]] || cc_loc=0
        [[ "$cc_functions" =~ ^[0-9]+$ ]] || cc_functions=0
        [[ "$cc_longest_func" =~ ^[0-9]+$ ]] || cc_longest_func=0
        [[ "$cc_avg_loc_func" =~ ^[0-9]+$ ]] || cc_avg_loc_func=0
        [[ "$cc_imports" =~ ^[0-9]+$ ]] || cc_imports=0

        jq --argjson impl_loc "$impl_loc" \
           --argjson test_loc "$test_loc" \
           --argjson test_count "$test_count" \
           --argjson todo_count "$todo_count" \
           --argjson total_mass "$total_mass" \
           --argjson tests_passed "$tests_passed" \
           --argjson total_tokens "$summary_total_tokens" \
           --argjson context_util "$summary_context_util" \
           --argjson cycle_count "$summary_cycle_count" \
           --argjson refactorings "$summary_refactorings" \
           --argjson pred_correct "$summary_pred_correct" \
           --argjson pred_total "$summary_pred_total" \
           --argjson tests_passed_immediately "$summary_tests_passed_immediately" \
           --argjson avg_cycle "$summary_avg_cycle" \
           --argjson avg_red "$summary_avg_red" \
           --argjson avg_green "$summary_avg_green" \
           --argjson avg_refactor "$summary_avg_refactor" \
           --argjson cov_statements "$cov_statements" \
           --argjson cov_branches "$cov_branches" \
           --argjson smell_total "$smell_total" \
           --argjson smell_complexity "$smell_complexity" \
           --argjson smell_duplication "$smell_duplication" \
           --argjson smell_magic_numbers "$smell_magic_numbers" \
           --argjson smell_code_quality "$smell_code_quality" \
           --argjson cc_loc "$cc_loc" \
           --argjson cc_functions "$cc_functions" \
           --argjson cc_longest_func "$cc_longest_func" \
           --argjson cc_avg_loc_func "$cc_avg_loc_func" \
           --argjson cc_imports "$cc_imports" \
           '.final_metrics.lines_of_code = $impl_loc |
            .final_metrics.test_lines = $test_loc |
            .final_metrics.tests_total = $test_count |
            .final_metrics.todos_remaining = $todo_count |
            .final_metrics.code_mass = $total_mass |
            .final_metrics.tests_passing = $tests_passed |
            .coverage.statements_pct = $cov_statements |
            .coverage.branches_pct = $cov_branches |
            .code_smells.total = $smell_total |
            .code_smells.complexity = $smell_complexity |
            .code_smells.duplication = $smell_duplication |
            .code_smells.magic_numbers = $smell_magic_numbers |
            .code_smells.code_quality = $smell_code_quality |
            .clean_code.loc = $cc_loc |
            .clean_code.functions = $cc_functions |
            .clean_code.longest_function = $cc_longest_func |
            .clean_code.avg_loc_per_function = $cc_avg_loc_func |
            .clean_code.imports = $cc_imports |
            .summary_metrics.total_tokens = $total_tokens |
            .summary_metrics.context_utilization_pct = $context_util |
            .summary_metrics.cycle_count = $cycle_count |
            .summary_metrics.refactorings_applied = $refactorings |
            .summary_metrics.predictions_correct = $pred_correct |
            .summary_metrics.predictions_total = $pred_total |
            .summary_metrics.tests_passed_immediately = $tests_passed_immediately |
            .summary_metrics.avg_cycle_seconds = $avg_cycle |
            .summary_metrics.avg_red_seconds = $avg_red |
            .summary_metrics.avg_green_seconds = $avg_green |
            .summary_metrics.avg_refactor_seconds = $avg_refactor' \
           "$run_dir/metrics.json" > "$run_dir/metrics.tmp" && \
        mv "$run_dir/metrics.tmp" "$run_dir/metrics.json"

        echo -e "\n${GREEN}Updated metrics.json with analysis results${NC}"
    fi

    # Save report
    echo -e "$report_content" > "$report_file"
    echo -e "${GREEN}Saved report to: $report_file${NC}"
}

compare_runs() {
    echo -e "\n${CYAN}Available Runs for Comparison:${NC}"

    local runs=()
    local i=1
    for run in "$RUNS_DIR"/*/; do
        if [ -d "$run" ]; then
            runs+=("$run")
            echo "  $i) $(basename "$run")"
            ((i++))
        fi
    done

    if [ ${#runs[@]} -lt 2 ]; then
        echo -e "${YELLOW}Need at least 2 runs to compare${NC}"
        return
    fi

    echo -e "\n${YELLOW}Select runs to compare (e.g., 1,2,3 or 'all'):${NC} "
    read -r selection

    local indices=()
    if [ "$selection" = "all" ]; then
        # Select all runs
        for i in $(seq 1 ${#runs[@]}); do
            indices+=("$i")
        done
    else
        IFS=',' read -ra indices <<< "$selection"
    fi

    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Comparison Report${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

    # Collect all run data first
    local run_data=()
    for idx in "${indices[@]}"; do
        idx=$((idx - 1))
        if [ $idx -ge 0 ] && [ $idx -lt ${#runs[@]} ]; then
            local run_dir="${runs[$idx]}"
            local run_name=$(basename "$run_dir")

            # Analyze (also saves individual report)
            analyze_single_run "$run_dir"

            # Extract data
            if [ -f "$run_dir/metrics.json" ] && command -v jq &> /dev/null; then
                local kata=$(jq -r '.kata // "unknown"' "$run_dir/metrics.json")
                local workflow=$(jq -r '.workflow // "unknown"' "$run_dir/metrics.json")
                local model=$(jq -r '.model // "unknown"' "$run_dir/metrics.json")
                local duration=$(jq -r '.duration_seconds // 0' "$run_dir/metrics.json")
                local tests=$(jq -r '.final_metrics.tests_total // 0' "$run_dir/metrics.json")
                local todos=$(jq -r '.final_metrics.todos_remaining // 0' "$run_dir/metrics.json")
                local mass=$(jq -r '.final_metrics.code_mass // 0' "$run_dir/metrics.json")
                local passed=$(jq -r '.final_metrics.tests_passing // false' "$run_dir/metrics.json")
                local started=$(jq -r '.started_at // ""' "$run_dir/metrics.json")
                # New metrics
                local tokens=$(jq -r '.summary_metrics.total_tokens // 0' "$run_dir/metrics.json")
                local ctx_util=$(jq -r '.summary_metrics.context_utilization_pct // 0' "$run_dir/metrics.json")
                local cycles=$(jq -r '.summary_metrics.cycle_count // 0' "$run_dir/metrics.json")
                local refacts=$(jq -r '.summary_metrics.refactorings_applied // 0' "$run_dir/metrics.json")
                local pred_c=$(jq -r '.summary_metrics.predictions_correct // 0' "$run_dir/metrics.json")
                local pred_t=$(jq -r '.summary_metrics.predictions_total // 0' "$run_dir/metrics.json")
                local immed=$(jq -r '.summary_metrics.tests_passed_immediately // 0' "$run_dir/metrics.json")
                # Coverage metrics (statements and branches only)
                local cov_statements=$(jq -r '.coverage.statements_pct // 0' "$run_dir/metrics.json")
                local cov_branches=$(jq -r '.coverage.branches_pct // 0' "$run_dir/metrics.json")
                # Code smell metrics
                local smell_total=$(jq -r '.code_smells.total // 0' "$run_dir/metrics.json")
                # Clean code metrics
                local cc_loc=$(jq -r '.clean_code.loc // 0' "$run_dir/metrics.json")
                local cc_functions=$(jq -r '.clean_code.functions // 0' "$run_dir/metrics.json")
                local cc_longest=$(jq -r '.clean_code.longest_function // 0' "$run_dir/metrics.json")

                # Store as: kata|workflow|run_name|duration|tests|todos|mass|passed|started|tokens|ctx_util|cycles|refacts|pred_c|pred_t|immed|cov_statements|cov_branches|smell_total|cc_loc|cc_functions|cc_longest|model
                run_data+=("${kata}|${workflow}|${run_name}|${duration}|${tests}|${todos}|${mass}|${passed}|${started}|${tokens}|${ctx_util}|${cycles}|${refacts}|${pred_c}|${pred_t}|${immed}|${cov_statements}|${cov_branches}|${smell_total}|${cc_loc}|${cc_functions}|${cc_longest}|${model}")
            fi
        fi
    done

    # Generate comparison report with grouped tables
    generate_grouped_report "${run_data[@]}"
}

# Calculate standard deviation (integer approximation)
# Usage: calc_stddev value1 value2 value3 ...
# For large numbers (tokens), uses scaling to avoid integer overflow
calc_stddev() {
    local values=("$@")
    local count=${#values[@]}

    if [ $count -lt 2 ]; then
        echo "0"
        return
    fi

    # Calculate mean
    local sum=0
    local valid_count=0
    for val in "${values[@]}"; do
        if [[ "$val" =~ ^[0-9]+$ ]]; then
            sum=$((sum + val))
            valid_count=$((valid_count + 1))
        fi
    done

    if [ $valid_count -lt 2 ]; then
        echo "0"
        return
    fi

    local mean=$((sum / valid_count))

    # Check if values are large (> 100000) - use scaling to avoid overflow
    local scale=1
    if [ $mean -gt 100000 ]; then
        scale=1000
    elif [ $mean -gt 10000 ]; then
        scale=100
    elif [ $mean -gt 1000 ]; then
        scale=10
    fi

    # Calculate sum of squared differences (with scaling for large numbers)
    local sq_diff_sum=0
    for val in "${values[@]}"; do
        if [[ "$val" =~ ^[0-9]+$ ]]; then
            local diff=$(( (val - mean) / scale ))
            sq_diff_sum=$((sq_diff_sum + diff * diff))
        fi
    done

    # Variance (scaled)
    local variance=$((sq_diff_sum / valid_count))

    if [ $variance -eq 0 ]; then
        echo "0"
        return
    fi

    # Integer square root using binary search (safer than Newton's method)
    local low=0
    local high=$variance
    local mid=0
    local result=0

    while [ $low -le $high ]; do
        mid=$(( (low + high) / 2 ))
        local sq=$((mid * mid))
        if [ $sq -eq $variance ]; then
            result=$mid
            break
        elif [ $sq -lt $variance ]; then
            result=$mid
            low=$((mid + 1))
        else
            high=$((mid - 1))
        fi
    done

    # Unscale the result
    echo $((result * scale))
}

# Generate report with separate tables per kata, sorted by workflow
generate_grouped_report() {
    local run_data=("$@")
    local comparison_file="$RUNS_DIR/comparison-$(date +%Y%m%d-%H%M%S).md"

    local report_content="# Experiment Comparison Report\n\n"
    report_content+="Generated: $(date -Iseconds)\n\n"

    # Get unique katas (sorted)
    local katas=()
    for entry in "${run_data[@]}"; do
        local kata=$(echo "$entry" | cut -d'|' -f1)
        if [[ ! " ${katas[*]} " =~ " ${kata} " ]]; then
            katas+=("$kata")
        fi
    done
    IFS=$'\n' katas=($(sort <<< "${katas[*]}")); unset IFS

    # Generate table for each kata
    for kata in "${katas[@]}"; do
        report_content+="## Kata: ${kata}\n\n"

        # Main metrics table
        report_content+="### Core Metrics\n\n"
        report_content+="| Workflow | Model | Run | Duration | Tests | Mass | Passed |\n"
        report_content+="|----------|-------|-----|----------|-------|------|--------|\n"

        # Filter and sort entries for this kata by workflow, then by model, then by timestamp
        local kata_entries=()
        for entry in "${run_data[@]}"; do
            local entry_kata=$(echo "$entry" | cut -d'|' -f1)
            if [ "$entry_kata" = "$kata" ]; then
                kata_entries+=("$entry")
            fi
        done

        # Sort by workflow (field 2), then by model (field 23), then by started timestamp (field 9)
        IFS=$'\n' sorted_entries=($(for e in "${kata_entries[@]}"; do echo "$e"; done | sort -t'|' -k2,2 -k23,23 -k9,9)); unset IFS

        for entry in "${sorted_entries[@]}"; do
            local workflow=$(echo "$entry" | cut -d'|' -f2)
            local run_name=$(echo "$entry" | cut -d'|' -f3)
            local duration=$(echo "$entry" | cut -d'|' -f4)
            local tests=$(echo "$entry" | cut -d'|' -f5)
            local mass=$(echo "$entry" | cut -d'|' -f7)
            local passed=$(echo "$entry" | cut -d'|' -f8)
            local model=$(echo "$entry" | cut -d'|' -f23)

            local passed_icon="❌"
            if [ "$passed" = "true" ]; then
                passed_icon="✅"
            fi

            report_content+="| ${workflow} | ${model} | ${run_name} | ${duration}s | ${tests} | ${mass} | ${passed_icon} |\n"
        done

        # Token & Context table
        report_content+="\n### Token Usage & Context\n\n"
        report_content+="| Workflow | Model | Run | Tokens | Ctx Util | Cycles |\n"
        report_content+="|----------|-------|-----|--------|----------|--------|\n"

        for entry in "${sorted_entries[@]}"; do
            local workflow=$(echo "$entry" | cut -d'|' -f2)
            local run_name=$(echo "$entry" | cut -d'|' -f3)
            local tokens=$(echo "$entry" | cut -d'|' -f10)
            local ctx_util=$(echo "$entry" | cut -d'|' -f11)
            local cycles=$(echo "$entry" | cut -d'|' -f12)
            local model=$(echo "$entry" | cut -d'|' -f23)

            report_content+="| ${workflow} | ${model} | ${run_name} | ${tokens} | ${ctx_util}% | ${cycles} |\n"
        done

        # TDD Discipline table
        report_content+="\n### TDD Discipline\n\n"
        report_content+="| Workflow | Model | Run | Refactorings | Pred Accuracy | Tests Immed |\n"
        report_content+="|----------|-------|-----|--------------|---------------|-------------|\n"

        for entry in "${sorted_entries[@]}"; do
            local workflow=$(echo "$entry" | cut -d'|' -f2)
            local run_name=$(echo "$entry" | cut -d'|' -f3)
            local refacts=$(echo "$entry" | cut -d'|' -f13)
            local pred_c=$(echo "$entry" | cut -d'|' -f14)
            local pred_t=$(echo "$entry" | cut -d'|' -f15)
            local immed=$(echo "$entry" | cut -d'|' -f16)
            local model=$(echo "$entry" | cut -d'|' -f23)

            local pred_str="N/A"
            if [[ "$pred_t" =~ ^[0-9]+$ ]] && [ "$pred_t" -gt 0 ]; then
                pred_str="${pred_c}/${pred_t}"
            fi

            report_content+="| ${workflow} | ${model} | ${run_name} | ${refacts} | ${pred_str} | ${immed} |\n"
        done

        # Coverage table
        report_content+="\n### Coverage\n\n"
        report_content+="| Workflow | Model | Run | Statements | Branches |\n"
        report_content+="|----------|-------|-----|------------|----------|\n"

        for entry in "${sorted_entries[@]}"; do
            local workflow=$(echo "$entry" | cut -d'|' -f2)
            local run_name=$(echo "$entry" | cut -d'|' -f3)
            local cov_statements=$(echo "$entry" | cut -d'|' -f17)
            local cov_branches=$(echo "$entry" | cut -d'|' -f18)
            local model=$(echo "$entry" | cut -d'|' -f23)

            [[ "$cov_statements" =~ ^[0-9]+$ ]] || cov_statements=0
            [[ "$cov_branches" =~ ^[0-9]+$ ]] || cov_branches=0

            report_content+="| ${workflow} | ${model} | ${run_name} | ${cov_statements}% | ${cov_branches}% |\n"
        done

        # Code Smells table
        report_content+="\n### Code Smells\n\n"
        report_content+="| Workflow | Model | Run | Total Smells |\n"
        report_content+="|----------|-------|-----|-------------|\n"

        for entry in "${sorted_entries[@]}"; do
            local workflow=$(echo "$entry" | cut -d'|' -f2)
            local run_name=$(echo "$entry" | cut -d'|' -f3)
            local smell_total=$(echo "$entry" | cut -d'|' -f19)
            local model=$(echo "$entry" | cut -d'|' -f23)

            [[ "$smell_total" =~ ^[0-9]+$ ]] || smell_total=0

            report_content+="| ${workflow} | ${model} | ${run_name} | ${smell_total} |\n"
        done

        # Clean Code table
        report_content+="\n### Clean Code Metrics\n\n"
        report_content+="| Workflow | Model | Run | LOC | Functions | LOC/Func | Longest Func |\n"
        report_content+="|----------|-------|-----|-----|-----------|----------|-------------|\n"

        for entry in "${sorted_entries[@]}"; do
            local workflow=$(echo "$entry" | cut -d'|' -f2)
            local run_name=$(echo "$entry" | cut -d'|' -f3)
            local cc_loc=$(echo "$entry" | cut -d'|' -f20)
            local cc_funcs=$(echo "$entry" | cut -d'|' -f21)
            local cc_longest=$(echo "$entry" | cut -d'|' -f22)
            local model=$(echo "$entry" | cut -d'|' -f23)

            [[ "$cc_loc" =~ ^[0-9]+$ ]] || cc_loc=0
            [[ "$cc_funcs" =~ ^[0-9]+$ ]] || cc_funcs=0
            [[ "$cc_longest" =~ ^[0-9]+$ ]] || cc_longest=0

            local cc_loc_per_func=0
            [ "$cc_funcs" -gt 0 ] && cc_loc_per_func=$((cc_loc / cc_funcs))

            report_content+="| ${workflow} | ${model} | ${run_name} | ${cc_loc} | ${cc_funcs} | ${cc_loc_per_func} | ${cc_longest} |\n"
        done

        # Get unique workflow+model combinations for this kata (used as grouping key for statistics)
        local wf_models=()
        for entry in "${kata_entries[@]}"; do
            local wf=$(echo "$entry" | cut -d'|' -f2)
            local mdl=$(echo "$entry" | cut -d'|' -f23)
            local wfm="${wf}|${mdl}"
            if [[ ! " ${wf_models[*]} " =~ " ${wfm} " ]]; then
                wf_models+=("$wfm")
            fi
        done
        IFS=$'\n' wf_models=($(sort <<< "${wf_models[*]}")); unset IFS

        # Collect all metrics per workflow+model for statistics
        declare -A wf_count wf_passed_count
        declare -A wf_durations wf_masses wf_tokens wf_ctx_utils wf_cycles wf_refacts wf_pred_c wf_pred_t wf_immeds wf_smells

        for wfm in "${wf_models[@]}"; do
            wf_count[$wfm]=0
            wf_passed_count[$wfm]=0
            wf_durations[$wfm]=""
            wf_masses[$wfm]=""
            wf_tokens[$wfm]=""
            wf_ctx_utils[$wfm]=""
            wf_cycles[$wfm]=""
            wf_refacts[$wfm]=""
            wf_pred_c[$wfm]=0
            wf_pred_t[$wfm]=0
            wf_immeds[$wfm]=""
            wf_cov_statements[$wfm]=""
            wf_cov_branches[$wfm]=""
            wf_smells[$wfm]=""
            wf_cc_loc[$wfm]=""
            wf_cc_funcs[$wfm]=""
            wf_cc_longest[$wfm]=""
        done

        for entry in "${kata_entries[@]}"; do
            local wf=$(echo "$entry" | cut -d'|' -f2)
            local mdl=$(echo "$entry" | cut -d'|' -f23)
            local wfm="${wf}|${mdl}"
            local dur=$(echo "$entry" | cut -d'|' -f4)
            local mss=$(echo "$entry" | cut -d'|' -f7)
            local psd=$(echo "$entry" | cut -d'|' -f8)
            local tok=$(echo "$entry" | cut -d'|' -f10)
            local ctx=$(echo "$entry" | cut -d'|' -f11)
            local cyc=$(echo "$entry" | cut -d'|' -f12)
            local ref=$(echo "$entry" | cut -d'|' -f13)
            local pc=$(echo "$entry" | cut -d'|' -f14)
            local pt=$(echo "$entry" | cut -d'|' -f15)
            local imm=$(echo "$entry" | cut -d'|' -f16)
            local covs=$(echo "$entry" | cut -d'|' -f17)
            local covb=$(echo "$entry" | cut -d'|' -f18)
            local sml=$(echo "$entry" | cut -d'|' -f19)
            local ccloc=$(echo "$entry" | cut -d'|' -f20)
            local ccfunc=$(echo "$entry" | cut -d'|' -f21)
            local cclongest=$(echo "$entry" | cut -d'|' -f22)

            wf_count[$wfm]=$((${wf_count[$wfm]} + 1))
            [ "$psd" = "true" ] && wf_passed_count[$wfm]=$((${wf_passed_count[$wfm]} + 1))

            [[ "$dur" =~ ^[0-9]+$ ]] && wf_durations[$wfm]="${wf_durations[$wfm]} $dur"
            [[ "$mss" =~ ^[0-9]+$ ]] && wf_masses[$wfm]="${wf_masses[$wfm]} $mss"
            [[ "$tok" =~ ^[0-9]+$ ]] && wf_tokens[$wfm]="${wf_tokens[$wfm]} $tok"
            [[ "$ctx" =~ ^[0-9]+$ ]] && wf_ctx_utils[$wfm]="${wf_ctx_utils[$wfm]} $ctx"
            [[ "$cyc" =~ ^[0-9]+$ ]] && wf_cycles[$wfm]="${wf_cycles[$wfm]} $cyc"
            [[ "$ref" =~ ^[0-9]+$ ]] && wf_refacts[$wfm]="${wf_refacts[$wfm]} $ref"
            [[ "$pc" =~ ^[0-9]+$ ]] && wf_pred_c[$wfm]=$((${wf_pred_c[$wfm]} + pc))
            [[ "$covs" =~ ^[0-9]+$ ]] && wf_cov_statements[$wfm]="${wf_cov_statements[$wfm]} $covs"
            [[ "$covb" =~ ^[0-9]+$ ]] && wf_cov_branches[$wfm]="${wf_cov_branches[$wfm]} $covb"
            [[ "$pt" =~ ^[0-9]+$ ]] && wf_pred_t[$wfm]=$((${wf_pred_t[$wfm]} + pt))
            [[ "$imm" =~ ^[0-9]+$ ]] && wf_immeds[$wfm]="${wf_immeds[$wfm]} $imm"
            [[ "$sml" =~ ^[0-9]+$ ]] && wf_smells[$wfm]="${wf_smells[$wfm]} $sml"
            [[ "$ccloc" =~ ^[0-9]+$ ]] && wf_cc_loc[$wfm]="${wf_cc_loc[$wfm]} $ccloc"
            [[ "$ccfunc" =~ ^[0-9]+$ ]] && wf_cc_funcs[$wfm]="${wf_cc_funcs[$wfm]} $ccfunc"
            [[ "$cclongest" =~ ^[0-9]+$ ]] && wf_cc_longest[$wfm]="${wf_cc_longest[$wfm]} $cclongest"
        done

        # Statistics Table 1: Core Metrics
        report_content+="\n### Statistics: Core Metrics\n\n"
        report_content+="| Workflow | Model | Runs | Avg Duration | σ Duration | Avg Mass | σ Mass | Success Rate |\n"
        report_content+="|----------|-------|------|--------------|------------|----------|--------|-------------|\n"

        for wfm in "${wf_models[@]}"; do
            local cnt=${wf_count[$wfm]}
            if [ $cnt -gt 0 ]; then
                local wf_name=$(echo "$wfm" | cut -d'|' -f1)
                local mdl_name=$(echo "$wfm" | cut -d'|' -f2)
                local durs=(${wf_durations[$wfm]})
                local msss=(${wf_masses[$wfm]})

                local sum_dur=0; for v in "${durs[@]}"; do sum_dur=$((sum_dur + v)); done
                local sum_mss=0; for v in "${msss[@]}"; do sum_mss=$((sum_mss + v)); done

                local avg_dur=$((sum_dur / cnt))
                local avg_mss=$((sum_mss / cnt))
                local success_rate=$((${wf_passed_count[$wfm]} * 100 / cnt))

                local stddev_dur=$(calc_stddev "${durs[@]}")
                local stddev_mss=$(calc_stddev "${msss[@]}")

                report_content+="| ${wf_name} | ${mdl_name} | ${cnt} | ${avg_dur}s | ±${stddev_dur}s | ${avg_mss} | ±${stddev_mss} | ${success_rate}% |\n"
            fi
        done

        # Statistics Table 2: Token Usage & Context
        report_content+="\n### Statistics: Token Usage & Context\n\n"
        report_content+="| Workflow | Model | Runs | Avg Tokens | σ Tokens | Avg Ctx Util | σ Ctx Util | Avg Cycles | σ Cycles |\n"
        report_content+="|----------|-------|------|------------|----------|--------------|------------|------------|----------|\n"

        for wfm in "${wf_models[@]}"; do
            local cnt=${wf_count[$wfm]}
            if [ $cnt -gt 0 ]; then
                local wf_name=$(echo "$wfm" | cut -d'|' -f1)
                local mdl_name=$(echo "$wfm" | cut -d'|' -f2)
                local toks=(${wf_tokens[$wfm]})
                local ctxs=(${wf_ctx_utils[$wfm]})
                local cycs=(${wf_cycles[$wfm]})

                local sum_tok=0; for v in "${toks[@]}"; do sum_tok=$((sum_tok + v)); done
                local sum_ctx=0; for v in "${ctxs[@]}"; do sum_ctx=$((sum_ctx + v)); done
                local sum_cyc=0; for v in "${cycs[@]}"; do sum_cyc=$((sum_cyc + v)); done

                local avg_tok=0; [ ${#toks[@]} -gt 0 ] && avg_tok=$((sum_tok / ${#toks[@]}))
                local avg_ctx=0; [ ${#ctxs[@]} -gt 0 ] && avg_ctx=$((sum_ctx / ${#ctxs[@]}))
                local avg_cyc=0; [ ${#cycs[@]} -gt 0 ] && avg_cyc=$((sum_cyc / ${#cycs[@]}))

                local stddev_tok=$(calc_stddev "${toks[@]}")
                local stddev_ctx=$(calc_stddev "${ctxs[@]}")
                local stddev_cyc=$(calc_stddev "${cycs[@]}")

                report_content+="| ${wf_name} | ${mdl_name} | ${cnt} | ${avg_tok} | ±${stddev_tok} | ${avg_ctx}% | ±${stddev_ctx}% | ${avg_cyc} | ±${stddev_cyc} |\n"
            fi
        done

        # Statistics Table 3: TDD Discipline
        report_content+="\n### Statistics: TDD Discipline\n\n"
        report_content+="| Workflow | Model | Runs | Avg Refactorings | σ Refactorings | Pred Accuracy | Avg Tests Immed | σ Tests Immed |\n"
        report_content+="|----------|-------|------|------------------|----------------|---------------|-----------------|---------------|\n"

        for wfm in "${wf_models[@]}"; do
            local cnt=${wf_count[$wfm]}
            if [ $cnt -gt 0 ]; then
                local wf_name=$(echo "$wfm" | cut -d'|' -f1)
                local mdl_name=$(echo "$wfm" | cut -d'|' -f2)
                local refs=(${wf_refacts[$wfm]})
                local imms=(${wf_immeds[$wfm]})
                local pred_c_total=${wf_pred_c[$wfm]}
                local pred_t_total=${wf_pred_t[$wfm]}

                local sum_ref=0; for v in "${refs[@]}"; do sum_ref=$((sum_ref + v)); done
                local sum_imm=0; for v in "${imms[@]}"; do sum_imm=$((sum_imm + v)); done

                local avg_ref=0; [ ${#refs[@]} -gt 0 ] && avg_ref=$((sum_ref / ${#refs[@]}))
                local avg_imm=0; [ ${#imms[@]} -gt 0 ] && avg_imm=$((sum_imm / ${#imms[@]}))

                local stddev_ref=$(calc_stddev "${refs[@]}")
                local stddev_imm=$(calc_stddev "${imms[@]}")

                local pred_str="N/A"
                if [ $pred_t_total -gt 0 ]; then
                    local pred_pct=$((pred_c_total * 100 / pred_t_total))
                    pred_str="${pred_c_total}/${pred_t_total} (${pred_pct}%)"
                fi

                report_content+="| ${wf_name} | ${mdl_name} | ${cnt} | ${avg_ref} | ±${stddev_ref} | ${pred_str} | ${avg_imm} | ±${stddev_imm} |\n"
            fi
        done

        # Statistics Table 4: Coverage
        report_content+="\n### Statistics: Coverage\n\n"
        report_content+="| Workflow | Model | Runs | Avg Statements | σ Statements | Avg Branches | σ Branches |\n"
        report_content+="|----------|-------|------|----------------|--------------|--------------|------------|\n"

        for wfm in "${wf_models[@]}"; do
            local cnt=${wf_count[$wfm]}
            if [ $cnt -gt 0 ]; then
                local wf_name=$(echo "$wfm" | cut -d'|' -f1)
                local mdl_name=$(echo "$wfm" | cut -d'|' -f2)
                local covss=(${wf_cov_statements[$wfm]})
                local covbs=(${wf_cov_branches[$wfm]})

                local sum_covs=0; for v in "${covss[@]}"; do sum_covs=$((sum_covs + v)); done
                local sum_covb=0; for v in "${covbs[@]}"; do sum_covb=$((sum_covb + v)); done

                local avg_covs=0; [ ${#covss[@]} -gt 0 ] && avg_covs=$((sum_covs / ${#covss[@]}))
                local avg_covb=0; [ ${#covbs[@]} -gt 0 ] && avg_covb=$((sum_covb / ${#covbs[@]}))

                local stddev_covs=$(calc_stddev "${covss[@]}")
                local stddev_covb=$(calc_stddev "${covbs[@]}")

                report_content+="| ${wf_name} | ${mdl_name} | ${cnt} | ${avg_covs}% | ±${stddev_covs}% | ${avg_covb}% | ±${stddev_covb}% |\n"
            fi
        done

        # Statistics Table 5: Code Smells
        report_content+="\n### Statistics: Code Smells\n\n"
        report_content+="| Workflow | Model | Runs | Avg Smells | σ Smells |\n"
        report_content+="|----------|-------|------|------------|----------|\n"

        for wfm in "${wf_models[@]}"; do
            local cnt=${wf_count[$wfm]}
            if [ $cnt -gt 0 ]; then
                local wf_name=$(echo "$wfm" | cut -d'|' -f1)
                local mdl_name=$(echo "$wfm" | cut -d'|' -f2)
                local smls=(${wf_smells[$wfm]})

                local sum_sml=0; for v in "${smls[@]}"; do sum_sml=$((sum_sml + v)); done

                local avg_sml=0; [ ${#smls[@]} -gt 0 ] && avg_sml=$((sum_sml / ${#smls[@]}))

                local stddev_sml=$(calc_stddev "${smls[@]}")

                report_content+="| ${wf_name} | ${mdl_name} | ${cnt} | ${avg_sml} | ±${stddev_sml} |\n"
            fi
        done

        # Statistics Table 6: Clean Code
        report_content+="\n### Statistics: Clean Code\n\n"
        report_content+="| Workflow | Model | Runs | Avg LOC | σ LOC | Avg Functions | Avg LOC/Func | Avg Longest Func |\n"
        report_content+="|----------|-------|------|---------|-------|---------------|--------------|------------------|\n"

        for wfm in "${wf_models[@]}"; do
            local cnt=${wf_count[$wfm]}
            if [ $cnt -gt 0 ]; then
                local wf_name=$(echo "$wfm" | cut -d'|' -f1)
                local mdl_name=$(echo "$wfm" | cut -d'|' -f2)
                local cclocs=(${wf_cc_loc[$wfm]})
                local ccfuncs=(${wf_cc_funcs[$wfm]})
                local cclongests=(${wf_cc_longest[$wfm]})

                local sum_ccloc=0; for v in "${cclocs[@]}"; do sum_ccloc=$((sum_ccloc + v)); done
                local sum_ccfunc=0; for v in "${ccfuncs[@]}"; do sum_ccfunc=$((sum_ccfunc + v)); done
                local sum_cclongest=0; for v in "${cclongests[@]}"; do sum_cclongest=$((sum_cclongest + v)); done

                local avg_ccloc=0; [ ${#cclocs[@]} -gt 0 ] && avg_ccloc=$((sum_ccloc / ${#cclocs[@]}))
                local avg_ccfunc=0; [ ${#ccfuncs[@]} -gt 0 ] && avg_ccfunc=$((sum_ccfunc / ${#ccfuncs[@]}))
                local avg_cclongest=0; [ ${#cclongests[@]} -gt 0 ] && avg_cclongest=$((sum_cclongest / ${#cclongests[@]}))

                local avg_loc_per_func=0
                [ "$avg_ccfunc" -gt 0 ] && avg_loc_per_func=$((avg_ccloc / avg_ccfunc))

                local stddev_ccloc=$(calc_stddev "${cclocs[@]}")

                report_content+="| ${wf_name} | ${mdl_name} | ${cnt} | ${avg_ccloc} | ±${stddev_ccloc} | ${avg_ccfunc} | ${avg_loc_per_func} | ${avg_cclongest} |\n"
            fi
        done

        report_content+="\n"
    done

    report_content+="## Metrics Legend\n\n"
    report_content+="| Metric | Description |\n"
    report_content+="|--------|-------------|\n"
    report_content+="| Model | Model configuration (opus, opus-no-thinking, sonnet, sonnet-no-thinking) |\n"
    report_content+="| Duration | Total experiment time in seconds |\n"
    report_content+="| Mass | APP (Absolute Priority Premise) code complexity score |\n"
    report_content+="| Tokens | Total tokens consumed by the AI |\n"
    report_content+="| Ctx Util | Final context window utilization percentage |\n"
    report_content+="| Cycles | Number of TDD Red-Green-Refactor cycles |\n"
    report_content+="| Refactorings | Number of refactorings applied |\n"
    report_content+="| Pred Accuracy | Prediction accuracy in Red phase (correct/total) |\n"
    report_content+="| Tests Immed | Tests that passed immediately (indicates over-implementation) |\n"
    report_content+="| Statements | Statement coverage percentage |\n"
    report_content+="| Branches | Branch coverage percentage |\n"
    report_content+="| Smells | Total code smells detected by ESLint (complexity, duplication, magic numbers, code quality) |\n"
    report_content+="| LOC | Lines of code (non-blank, non-comment) |\n"
    report_content+="| Functions | Number of functions in implementation |\n"
    report_content+="| LOC/Func | Average lines of code per function |\n"
    report_content+="| Longest Func | Lines of code in longest function |\n"
    report_content+="| σ (Sigma) | Standard deviation - lower = more consistent |\n\n"

    report_content+="## Notes\n\n"
    report_content+="- Tables are grouped by **Kata** (experiments are only comparable within the same kata)\n"
    report_content+="- Within each kata, runs are sorted by **Workflow**, then by **Model**, then by **timestamp**\n"
    report_content+="- Statistics are grouped by **Workflow + Model** combination\n"
    report_content+="- Individual analysis reports are saved in each run directory\n"

    echo -e "$report_content" > "$comparison_file"
    echo -e "\n${GREEN}Saved comparison report to: $comparison_file${NC}"
}

analyze_all() {
    echo -e "\n${CYAN}Analyzing all runs...${NC}"

    # Collect all run data
    local run_data=()

    for run in "$RUNS_DIR"/*/; do
        if [ -d "$run" ]; then
            analyze_single_run "$run"

            # Collect data
            if [ -f "$run/metrics.json" ] && command -v jq &> /dev/null; then
                local run_name=$(basename "$run")
                local kata=$(jq -r '.kata // "unknown"' "$run/metrics.json")
                local workflow=$(jq -r '.workflow // "unknown"' "$run/metrics.json")
                local model=$(jq -r '.model // "unknown"' "$run/metrics.json")
                local duration=$(jq -r '.duration_seconds // 0' "$run/metrics.json")
                local tests=$(jq -r '.final_metrics.tests_total // 0' "$run/metrics.json")
                local todos=$(jq -r '.final_metrics.todos_remaining // 0' "$run/metrics.json")
                local mass=$(jq -r '.final_metrics.code_mass // 0' "$run/metrics.json")
                local passed=$(jq -r '.final_metrics.tests_passing // false' "$run/metrics.json")
                local started=$(jq -r '.started_at // ""' "$run/metrics.json")
                # New metrics
                local tokens=$(jq -r '.summary_metrics.total_tokens // 0' "$run/metrics.json")
                local ctx_util=$(jq -r '.summary_metrics.context_utilization_pct // 0' "$run/metrics.json")
                local cycles=$(jq -r '.summary_metrics.cycle_count // 0' "$run/metrics.json")
                local refacts=$(jq -r '.summary_metrics.refactorings_applied // 0' "$run/metrics.json")
                local pred_c=$(jq -r '.summary_metrics.predictions_correct // 0' "$run/metrics.json")
                local pred_t=$(jq -r '.summary_metrics.predictions_total // 0' "$run/metrics.json")
                local immed=$(jq -r '.summary_metrics.tests_passed_immediately // 0' "$run/metrics.json")
                # Coverage metrics (statements and branches only)
                local cov_statements=$(jq -r '.coverage.statements_pct // 0' "$run/metrics.json")
                local cov_branches=$(jq -r '.coverage.branches_pct // 0' "$run/metrics.json")
                # Code smell metrics
                local smell_total=$(jq -r '.code_smells.total // 0' "$run/metrics.json")
                # Clean code metrics
                local cc_loc=$(jq -r '.clean_code.loc // 0' "$run/metrics.json")
                local cc_functions=$(jq -r '.clean_code.functions // 0' "$run/metrics.json")
                local cc_longest=$(jq -r '.clean_code.longest_function // 0' "$run/metrics.json")

                run_data+=("${kata}|${workflow}|${run_name}|${duration}|${tests}|${todos}|${mass}|${passed}|${started}|${tokens}|${ctx_util}|${cycles}|${refacts}|${pred_c}|${pred_t}|${immed}|${cov_statements}|${cov_branches}|${smell_total}|${cc_loc}|${cc_functions}|${cc_longest}|${model}")
            fi

            echo ""
        fi
    done

    # Generate grouped report
    local all_report="$RUNS_DIR/all-runs-analysis-$(date +%Y%m%d-%H%M%S).md"

    local report_content="# All Experiments Analysis\n\n"
    report_content+="Generated: $(date -Iseconds)\n\n"
    report_content+="Total runs analyzed: ${#run_data[@]}\n\n"

    # Get unique katas (sorted)
    local katas=()
    for entry in "${run_data[@]}"; do
        local kata=$(echo "$entry" | cut -d'|' -f1)
        if [[ ! " ${katas[*]} " =~ " ${kata} " ]]; then
            katas+=("$kata")
        fi
    done
    IFS=$'\n' katas=($(sort <<< "${katas[*]}")); unset IFS

    # Generate table for each kata
    for kata in "${katas[@]}"; do
        report_content+="## Kata: ${kata}\n\n"

        # Filter entries for this kata
        local kata_entries=()
        for entry in "${run_data[@]}"; do
            local entry_kata=$(echo "$entry" | cut -d'|' -f1)
            if [ "$entry_kata" = "$kata" ]; then
                kata_entries+=("$entry")
            fi
        done

        # Sort by workflow, then by model, then by timestamp
        IFS=$'\n' sorted_entries=($(for e in "${kata_entries[@]}"; do echo "$e"; done | sort -t'|' -k2,2 -k23,23 -k9,9)); unset IFS

        # Main metrics table
        report_content+="### Core Metrics\n\n"
        report_content+="| Workflow | Model | Run | Duration | Tests | Mass | Passed |\n"
        report_content+="|----------|-------|-----|----------|-------|------|--------|\n"

        for entry in "${sorted_entries[@]}"; do
            local workflow=$(echo "$entry" | cut -d'|' -f2)
            local run_name=$(echo "$entry" | cut -d'|' -f3)
            local duration=$(echo "$entry" | cut -d'|' -f4)
            local tests=$(echo "$entry" | cut -d'|' -f5)
            local mass=$(echo "$entry" | cut -d'|' -f7)
            local passed=$(echo "$entry" | cut -d'|' -f8)
            local model=$(echo "$entry" | cut -d'|' -f23)

            local passed_icon="❌"
            if [ "$passed" = "true" ]; then
                passed_icon="✅"
            fi

            report_content+="| ${workflow} | ${model} | ${run_name} | ${duration}s | ${tests} | ${mass} | ${passed_icon} |\n"
        done

        # Token & Context table
        report_content+="\n### Token Usage & Context\n\n"
        report_content+="| Workflow | Model | Run | Tokens | Ctx Util | Cycles |\n"
        report_content+="|----------|-------|-----|--------|----------|--------|\n"

        for entry in "${sorted_entries[@]}"; do
            local workflow=$(echo "$entry" | cut -d'|' -f2)
            local run_name=$(echo "$entry" | cut -d'|' -f3)
            local tokens=$(echo "$entry" | cut -d'|' -f10)
            local ctx_util=$(echo "$entry" | cut -d'|' -f11)
            local cycles=$(echo "$entry" | cut -d'|' -f12)
            local model=$(echo "$entry" | cut -d'|' -f23)

            report_content+="| ${workflow} | ${model} | ${run_name} | ${tokens} | ${ctx_util}% | ${cycles} |\n"
        done

        # TDD Discipline table
        report_content+="\n### TDD Discipline\n\n"
        report_content+="| Workflow | Model | Run | Refactorings | Pred Accuracy | Tests Immed |\n"
        report_content+="|----------|-------|-----|--------------|---------------|-------------|\n"

        for entry in "${sorted_entries[@]}"; do
            local workflow=$(echo "$entry" | cut -d'|' -f2)
            local run_name=$(echo "$entry" | cut -d'|' -f3)
            local refacts=$(echo "$entry" | cut -d'|' -f13)
            local pred_c=$(echo "$entry" | cut -d'|' -f14)
            local pred_t=$(echo "$entry" | cut -d'|' -f15)
            local immed=$(echo "$entry" | cut -d'|' -f16)
            local model=$(echo "$entry" | cut -d'|' -f23)

            local pred_str="N/A"
            if [[ "$pred_t" =~ ^[0-9]+$ ]] && [ "$pred_t" -gt 0 ]; then
                pred_str="${pred_c}/${pred_t}"
            fi

            report_content+="| ${workflow} | ${model} | ${run_name} | ${refacts} | ${pred_str} | ${immed} |\n"
        done

        # Coverage table
        report_content+="\n### Coverage\n\n"
        report_content+="| Workflow | Model | Run | Statements | Branches |\n"
        report_content+="|----------|-------|-----|------------|----------|\n"

        for entry in "${sorted_entries[@]}"; do
            local workflow=$(echo "$entry" | cut -d'|' -f2)
            local run_name=$(echo "$entry" | cut -d'|' -f3)
            local cov_statements=$(echo "$entry" | cut -d'|' -f17)
            local cov_branches=$(echo "$entry" | cut -d'|' -f18)
            local model=$(echo "$entry" | cut -d'|' -f23)

            [[ "$cov_statements" =~ ^[0-9]+$ ]] || cov_statements=0
            [[ "$cov_branches" =~ ^[0-9]+$ ]] || cov_branches=0

            report_content+="| ${workflow} | ${model} | ${run_name} | ${cov_statements}% | ${cov_branches}% |\n"
        done

        # Code Smells table
        report_content+="\n### Code Smells\n\n"
        report_content+="| Workflow | Model | Run | Total Smells |\n"
        report_content+="|----------|-------|-----|-------------|\n"

        for entry in "${sorted_entries[@]}"; do
            local workflow=$(echo "$entry" | cut -d'|' -f2)
            local run_name=$(echo "$entry" | cut -d'|' -f3)
            local smell_total=$(echo "$entry" | cut -d'|' -f19)
            local model=$(echo "$entry" | cut -d'|' -f23)

            [[ "$smell_total" =~ ^[0-9]+$ ]] || smell_total=0

            report_content+="| ${workflow} | ${model} | ${run_name} | ${smell_total} |\n"
        done

        # Clean Code table
        report_content+="\n### Clean Code Metrics\n\n"
        report_content+="| Workflow | Model | Run | LOC | Functions | LOC/Func | Longest Func |\n"
        report_content+="|----------|-------|-----|-----|-----------|----------|-------------|\n"

        for entry in "${sorted_entries[@]}"; do
            local workflow=$(echo "$entry" | cut -d'|' -f2)
            local run_name=$(echo "$entry" | cut -d'|' -f3)
            local cc_loc=$(echo "$entry" | cut -d'|' -f20)
            local cc_funcs=$(echo "$entry" | cut -d'|' -f21)
            local cc_longest=$(echo "$entry" | cut -d'|' -f22)
            local model=$(echo "$entry" | cut -d'|' -f23)

            [[ "$cc_loc" =~ ^[0-9]+$ ]] || cc_loc=0
            [[ "$cc_funcs" =~ ^[0-9]+$ ]] || cc_funcs=0
            [[ "$cc_longest" =~ ^[0-9]+$ ]] || cc_longest=0

            local cc_loc_per_func=0
            [ "$cc_funcs" -gt 0 ] && cc_loc_per_func=$((cc_loc / cc_funcs))

            report_content+="| ${workflow} | ${model} | ${run_name} | ${cc_loc} | ${cc_funcs} | ${cc_loc_per_func} | ${cc_longest} |\n"
        done

        # Get unique workflow+model combinations for this kata
        local wf_models=()
        for entry in "${kata_entries[@]}"; do
            local wf=$(echo "$entry" | cut -d'|' -f2)
            local mdl=$(echo "$entry" | cut -d'|' -f23)
            local wfm="${wf}|${mdl}"
            if [[ ! " ${wf_models[*]} " =~ " ${wfm} " ]]; then
                wf_models+=("$wfm")
            fi
        done
        IFS=$'\n' wf_models=($(sort <<< "${wf_models[*]}")); unset IFS

        # Collect all metrics per workflow+model for statistics
        declare -A wf_count wf_passed_count
        declare -A wf_durations wf_masses wf_tokens wf_ctx_utils wf_cycles wf_refacts wf_pred_c wf_pred_t wf_immeds wf_smells

        for wfm in "${wf_models[@]}"; do
            wf_count[$wfm]=0
            wf_passed_count[$wfm]=0
            wf_durations[$wfm]=""
            wf_masses[$wfm]=""
            wf_tokens[$wfm]=""
            wf_ctx_utils[$wfm]=""
            wf_cycles[$wfm]=""
            wf_refacts[$wfm]=""
            wf_pred_c[$wfm]=0
            wf_pred_t[$wfm]=0
            wf_immeds[$wfm]=""
            wf_cov_statements[$wfm]=""
            wf_cov_branches[$wfm]=""
            wf_smells[$wfm]=""
            wf_cc_loc[$wfm]=""
            wf_cc_funcs[$wfm]=""
            wf_cc_longest[$wfm]=""
        done

        for entry in "${kata_entries[@]}"; do
            local wf=$(echo "$entry" | cut -d'|' -f2)
            local mdl=$(echo "$entry" | cut -d'|' -f23)
            local wfm="${wf}|${mdl}"
            local dur=$(echo "$entry" | cut -d'|' -f4)
            local mss=$(echo "$entry" | cut -d'|' -f7)
            local psd=$(echo "$entry" | cut -d'|' -f8)
            local tok=$(echo "$entry" | cut -d'|' -f10)
            local ctx=$(echo "$entry" | cut -d'|' -f11)
            local cyc=$(echo "$entry" | cut -d'|' -f12)
            local ref=$(echo "$entry" | cut -d'|' -f13)
            local pc=$(echo "$entry" | cut -d'|' -f14)
            local pt=$(echo "$entry" | cut -d'|' -f15)
            local imm=$(echo "$entry" | cut -d'|' -f16)
            local covs=$(echo "$entry" | cut -d'|' -f17)
            local covb=$(echo "$entry" | cut -d'|' -f18)
            local sml=$(echo "$entry" | cut -d'|' -f19)
            local ccloc=$(echo "$entry" | cut -d'|' -f20)
            local ccfunc=$(echo "$entry" | cut -d'|' -f21)
            local cclongest=$(echo "$entry" | cut -d'|' -f22)

            wf_count[$wfm]=$((${wf_count[$wfm]} + 1))
            [ "$psd" = "true" ] && wf_passed_count[$wfm]=$((${wf_passed_count[$wfm]} + 1))

            [[ "$dur" =~ ^[0-9]+$ ]] && wf_durations[$wfm]="${wf_durations[$wfm]} $dur"
            [[ "$mss" =~ ^[0-9]+$ ]] && wf_masses[$wfm]="${wf_masses[$wfm]} $mss"
            [[ "$tok" =~ ^[0-9]+$ ]] && wf_tokens[$wfm]="${wf_tokens[$wfm]} $tok"
            [[ "$ctx" =~ ^[0-9]+$ ]] && wf_ctx_utils[$wfm]="${wf_ctx_utils[$wfm]} $ctx"
            [[ "$cyc" =~ ^[0-9]+$ ]] && wf_cycles[$wfm]="${wf_cycles[$wfm]} $cyc"
            [[ "$ref" =~ ^[0-9]+$ ]] && wf_refacts[$wfm]="${wf_refacts[$wfm]} $ref"
            [[ "$pc" =~ ^[0-9]+$ ]] && wf_pred_c[$wfm]=$((${wf_pred_c[$wfm]} + pc))
            [[ "$covs" =~ ^[0-9]+$ ]] && wf_cov_statements[$wfm]="${wf_cov_statements[$wfm]} $covs"
            [[ "$covb" =~ ^[0-9]+$ ]] && wf_cov_branches[$wfm]="${wf_cov_branches[$wfm]} $covb"
            [[ "$pt" =~ ^[0-9]+$ ]] && wf_pred_t[$wfm]=$((${wf_pred_t[$wfm]} + pt))
            [[ "$imm" =~ ^[0-9]+$ ]] && wf_immeds[$wfm]="${wf_immeds[$wfm]} $imm"
            [[ "$sml" =~ ^[0-9]+$ ]] && wf_smells[$wfm]="${wf_smells[$wfm]} $sml"
            [[ "$ccloc" =~ ^[0-9]+$ ]] && wf_cc_loc[$wfm]="${wf_cc_loc[$wfm]} $ccloc"
            [[ "$ccfunc" =~ ^[0-9]+$ ]] && wf_cc_funcs[$wfm]="${wf_cc_funcs[$wfm]} $ccfunc"
            [[ "$cclongest" =~ ^[0-9]+$ ]] && wf_cc_longest[$wfm]="${wf_cc_longest[$wfm]} $cclongest"
        done

        # Statistics Table 1: Core Metrics
        report_content+="\n### Statistics: Core Metrics\n\n"
        report_content+="| Workflow | Model | Runs | Avg Duration | σ Duration | Avg Mass | σ Mass | Success Rate |\n"
        report_content+="|----------|-------|------|--------------|------------|----------|--------|-------------|\n"

        for wfm in "${wf_models[@]}"; do
            local cnt=${wf_count[$wfm]}
            if [ $cnt -gt 0 ]; then
                local wf_name=$(echo "$wfm" | cut -d'|' -f1)
                local mdl_name=$(echo "$wfm" | cut -d'|' -f2)
                local durs=(${wf_durations[$wfm]})
                local msss=(${wf_masses[$wfm]})

                local sum_dur=0; for v in "${durs[@]}"; do sum_dur=$((sum_dur + v)); done
                local sum_mss=0; for v in "${msss[@]}"; do sum_mss=$((sum_mss + v)); done

                local avg_dur=$((sum_dur / cnt))
                local avg_mss=$((sum_mss / cnt))
                local success_rate=$((${wf_passed_count[$wfm]} * 100 / cnt))

                local stddev_dur=$(calc_stddev "${durs[@]}")
                local stddev_mss=$(calc_stddev "${msss[@]}")

                report_content+="| ${wf_name} | ${mdl_name} | ${cnt} | ${avg_dur}s | ±${stddev_dur}s | ${avg_mss} | ±${stddev_mss} | ${success_rate}% |\n"
            fi
        done

        # Statistics Table 2: Token Usage & Context
        report_content+="\n### Statistics: Token Usage & Context\n\n"
        report_content+="| Workflow | Model | Runs | Avg Tokens | σ Tokens | Avg Ctx Util | σ Ctx Util | Avg Cycles | σ Cycles |\n"
        report_content+="|----------|-------|------|------------|----------|--------------|------------|------------|----------|\n"

        for wfm in "${wf_models[@]}"; do
            local cnt=${wf_count[$wfm]}
            if [ $cnt -gt 0 ]; then
                local wf_name=$(echo "$wfm" | cut -d'|' -f1)
                local mdl_name=$(echo "$wfm" | cut -d'|' -f2)
                local toks=(${wf_tokens[$wfm]})
                local ctxs=(${wf_ctx_utils[$wfm]})
                local cycs=(${wf_cycles[$wfm]})

                local sum_tok=0; for v in "${toks[@]}"; do sum_tok=$((sum_tok + v)); done
                local sum_ctx=0; for v in "${ctxs[@]}"; do sum_ctx=$((sum_ctx + v)); done
                local sum_cyc=0; for v in "${cycs[@]}"; do sum_cyc=$((sum_cyc + v)); done

                local avg_tok=0; [ ${#toks[@]} -gt 0 ] && avg_tok=$((sum_tok / ${#toks[@]}))
                local avg_ctx=0; [ ${#ctxs[@]} -gt 0 ] && avg_ctx=$((sum_ctx / ${#ctxs[@]}))
                local avg_cyc=0; [ ${#cycs[@]} -gt 0 ] && avg_cyc=$((sum_cyc / ${#cycs[@]}))

                local stddev_tok=$(calc_stddev "${toks[@]}")
                local stddev_ctx=$(calc_stddev "${ctxs[@]}")
                local stddev_cyc=$(calc_stddev "${cycs[@]}")

                report_content+="| ${wf_name} | ${mdl_name} | ${cnt} | ${avg_tok} | ±${stddev_tok} | ${avg_ctx}% | ±${stddev_ctx}% | ${avg_cyc} | ±${stddev_cyc} |\n"
            fi
        done

        # Statistics Table 3: TDD Discipline
        report_content+="\n### Statistics: TDD Discipline\n\n"
        report_content+="| Workflow | Model | Runs | Avg Refactorings | σ Refactorings | Pred Accuracy | Avg Tests Immed | σ Tests Immed |\n"
        report_content+="|----------|-------|------|------------------|----------------|---------------|-----------------|---------------|\n"

        for wfm in "${wf_models[@]}"; do
            local cnt=${wf_count[$wfm]}
            if [ $cnt -gt 0 ]; then
                local wf_name=$(echo "$wfm" | cut -d'|' -f1)
                local mdl_name=$(echo "$wfm" | cut -d'|' -f2)
                local refs=(${wf_refacts[$wfm]})
                local imms=(${wf_immeds[$wfm]})
                local pred_c_total=${wf_pred_c[$wfm]}
                local pred_t_total=${wf_pred_t[$wfm]}

                local sum_ref=0; for v in "${refs[@]}"; do sum_ref=$((sum_ref + v)); done
                local sum_imm=0; for v in "${imms[@]}"; do sum_imm=$((sum_imm + v)); done

                local avg_ref=0; [ ${#refs[@]} -gt 0 ] && avg_ref=$((sum_ref / ${#refs[@]}))
                local avg_imm=0; [ ${#imms[@]} -gt 0 ] && avg_imm=$((sum_imm / ${#imms[@]}))

                local stddev_ref=$(calc_stddev "${refs[@]}")
                local stddev_imm=$(calc_stddev "${imms[@]}")

                local pred_str="N/A"
                if [ $pred_t_total -gt 0 ]; then
                    local pred_pct=$((pred_c_total * 100 / pred_t_total))
                    pred_str="${pred_c_total}/${pred_t_total} (${pred_pct}%)"
                fi

                report_content+="| ${wf_name} | ${mdl_name} | ${cnt} | ${avg_ref} | ±${stddev_ref} | ${pred_str} | ${avg_imm} | ±${stddev_imm} |\n"
            fi
        done

        # Statistics Table 4: Coverage
        report_content+="\n### Statistics: Coverage\n\n"
        report_content+="| Workflow | Model | Runs | Avg Statements | σ Statements | Avg Branches | σ Branches |\n"
        report_content+="|----------|-------|------|----------------|--------------|--------------|------------|\n"

        for wfm in "${wf_models[@]}"; do
            local cnt=${wf_count[$wfm]}
            if [ $cnt -gt 0 ]; then
                local wf_name=$(echo "$wfm" | cut -d'|' -f1)
                local mdl_name=$(echo "$wfm" | cut -d'|' -f2)
                local covss=(${wf_cov_statements[$wfm]})
                local covbs=(${wf_cov_branches[$wfm]})

                local sum_covs=0; for v in "${covss[@]}"; do sum_covs=$((sum_covs + v)); done
                local sum_covb=0; for v in "${covbs[@]}"; do sum_covb=$((sum_covb + v)); done

                local avg_covs=0; [ ${#covss[@]} -gt 0 ] && avg_covs=$((sum_covs / ${#covss[@]}))
                local avg_covb=0; [ ${#covbs[@]} -gt 0 ] && avg_covb=$((sum_covb / ${#covbs[@]}))

                local stddev_covs=$(calc_stddev "${covss[@]}")
                local stddev_covb=$(calc_stddev "${covbs[@]}")

                report_content+="| ${wf_name} | ${mdl_name} | ${cnt} | ${avg_covs}% | ±${stddev_covs}% | ${avg_covb}% | ±${stddev_covb}% |\n"
            fi
        done

        # Statistics Table 5: Code Smells
        report_content+="\n### Statistics: Code Smells\n\n"
        report_content+="| Workflow | Model | Runs | Avg Smells | σ Smells |\n"
        report_content+="|----------|-------|------|------------|----------|\n"

        for wfm in "${wf_models[@]}"; do
            local cnt=${wf_count[$wfm]}
            if [ $cnt -gt 0 ]; then
                local wf_name=$(echo "$wfm" | cut -d'|' -f1)
                local mdl_name=$(echo "$wfm" | cut -d'|' -f2)
                local smls=(${wf_smells[$wfm]})

                local sum_sml=0; for v in "${smls[@]}"; do sum_sml=$((sum_sml + v)); done

                local avg_sml=0; [ ${#smls[@]} -gt 0 ] && avg_sml=$((sum_sml / ${#smls[@]}))

                local stddev_sml=$(calc_stddev "${smls[@]}")

                report_content+="| ${wf_name} | ${mdl_name} | ${cnt} | ${avg_sml} | ±${stddev_sml} |\n"
            fi
        done

        # Statistics Table 6: Clean Code
        report_content+="\n### Statistics: Clean Code\n\n"
        report_content+="| Workflow | Model | Runs | Avg LOC | σ LOC | Avg Functions | Avg LOC/Func | Avg Longest Func |\n"
        report_content+="|----------|-------|------|---------|-------|---------------|--------------|------------------|\n"

        for wfm in "${wf_models[@]}"; do
            local cnt=${wf_count[$wfm]}
            if [ $cnt -gt 0 ]; then
                local wf_name=$(echo "$wfm" | cut -d'|' -f1)
                local mdl_name=$(echo "$wfm" | cut -d'|' -f2)
                local cclocs=(${wf_cc_loc[$wfm]})
                local ccfuncs=(${wf_cc_funcs[$wfm]})
                local cclongests=(${wf_cc_longest[$wfm]})

                local sum_ccloc=0; for v in "${cclocs[@]}"; do sum_ccloc=$((sum_ccloc + v)); done
                local sum_ccfunc=0; for v in "${ccfuncs[@]}"; do sum_ccfunc=$((sum_ccfunc + v)); done
                local sum_cclongest=0; for v in "${cclongests[@]}"; do sum_cclongest=$((sum_cclongest + v)); done

                local avg_ccloc=0; [ ${#cclocs[@]} -gt 0 ] && avg_ccloc=$((sum_ccloc / ${#cclocs[@]}))
                local avg_ccfunc=0; [ ${#ccfuncs[@]} -gt 0 ] && avg_ccfunc=$((sum_ccfunc / ${#ccfuncs[@]}))
                local avg_cclongest=0; [ ${#cclongests[@]} -gt 0 ] && avg_cclongest=$((sum_cclongest / ${#cclongests[@]}))

                local avg_loc_per_func=0
                [ "$avg_ccfunc" -gt 0 ] && avg_loc_per_func=$((avg_ccloc / avg_ccfunc))

                local stddev_ccloc=$(calc_stddev "${cclocs[@]}")

                report_content+="| ${wf_name} | ${mdl_name} | ${cnt} | ${avg_ccloc} | ±${stddev_ccloc} | ${avg_ccfunc} | ${avg_loc_per_func} | ${avg_cclongest} |\n"
            fi
        done

        report_content+="\n"
    done

    report_content+="## Metrics Legend\n\n"
    report_content+="| Metric | Description |\n"
    report_content+="|--------|-------------|\n"
    report_content+="| Model | Model configuration (opus, opus-no-thinking, sonnet, sonnet-no-thinking) |\n"
    report_content+="| Duration | Total experiment time in seconds |\n"
    report_content+="| Mass | APP (Absolute Priority Premise) code complexity score |\n"
    report_content+="| Tokens | Total tokens consumed by the AI |\n"
    report_content+="| Ctx Util | Final context window utilization percentage |\n"
    report_content+="| Cycles | Number of TDD Red-Green-Refactor cycles |\n"
    report_content+="| Refactorings | Number of refactorings applied |\n"
    report_content+="| Pred Accuracy | Prediction accuracy in Red phase (correct/total) |\n"
    report_content+="| Tests Immed | Tests that passed immediately (indicates over-implementation) |\n"
    report_content+="| Statements | Statement coverage percentage |\n"
    report_content+="| Branches | Branch coverage percentage |\n"
    report_content+="| Smells | Total code smells detected by ESLint (complexity, duplication, magic numbers, code quality) |\n"
    report_content+="| LOC | Lines of code (non-blank, non-comment) |\n"
    report_content+="| Functions | Number of functions in implementation |\n"
    report_content+="| LOC/Func | Average lines of code per function |\n"
    report_content+="| Longest Func | Lines of code in longest function |\n"
    report_content+="| σ (Sigma) | Standard deviation - lower = more consistent |\n\n"

    report_content+="## Notes\n\n"
    report_content+="- Tables are grouped by **Kata** (experiments are only comparable within the same kata)\n"
    report_content+="- Within each kata, runs are sorted by **Workflow**, then by **Model**, then by **timestamp**\n"
    report_content+="- Statistics are grouped by **Workflow + Model** combination\n"

    echo -e "$report_content" > "$all_report"
    echo -e "\n${GREEN}Saved all-runs analysis to: $all_report${NC}"
}

# Main
print_header

if [ -n "$1" ]; then
    if [ "$1" = "--all" ]; then
        analyze_all
    else
        # Analyze specific run
        analyze_single_run "$1"
    fi
else
    # Interactive mode
    echo -e "\n${YELLOW}Options:${NC}"
    echo "  1) Analyze single run"
    echo "  2) Compare runs"
    echo "  3) Analyze all runs"
    echo -e "\n${YELLOW}Select option:${NC} "
    read -r option

    case $option in
        1)
            echo -e "\n${CYAN}Available Runs:${NC}"
            i=1
            runs=()
            for run in "$RUNS_DIR"/*/; do
                if [ -d "$run" ]; then
                    runs+=("$run")
                    echo "  $i) $(basename "$run")"
                    ((i++))
                fi
            done

            echo -e "\n${YELLOW}Select run (number):${NC} "
            read -r run_num
            run_idx=$((run_num - 1))
            if [ $run_idx -ge 0 ] && [ $run_idx -lt ${#runs[@]} ]; then
                analyze_single_run "${runs[$run_idx]}"
            fi
            ;;
        2)
            compare_runs
            ;;
        3)
            analyze_all
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            ;;
    esac
fi

echo -e "\n${GREEN}Done!${NC}"
