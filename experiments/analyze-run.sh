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

            echo -e "${YELLOW}Kata:${NC} $kata"
            echo -e "${YELLOW}Workflow:${NC} $workflow"
            echo -e "${YELLOW}Duration:${NC} ${duration}s"

            report_content+="## Configuration\n\n"
            report_content+="| Property | Value |\n"
            report_content+="|----------|-------|\n"
            report_content+="| Kata | $kata |\n"
            report_content+="| Workflow | $workflow |\n"
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

    # Include source code in report
    if [ -n "$impl_file" ] && [ -f "$impl_file" ]; then
        report_content+="## Implementation Code\n\n"
        report_content+="\`\`\`typescript\n"
        report_content+="$(cat "$impl_file")\n"
        report_content+="\`\`\`\n\n"
    fi

    if [ -n "$test_file" ] && [ -f "$test_file" ]; then
        report_content+="## Test Code\n\n"
        report_content+="\`\`\`typescript\n"
        report_content+="$(cat "$test_file")\n"
        report_content+="\`\`\`\n\n"
    fi

    # Update metrics.json with analysis results
    if [ -f "$run_dir/metrics.json" ] && command -v jq &> /dev/null; then
        # Ensure all values are valid integers, default to 0
        [[ "$impl_loc" =~ ^[0-9]+$ ]] || impl_loc=0
        [[ "$test_loc" =~ ^[0-9]+$ ]] || test_loc=0
        [[ "$test_count" =~ ^[0-9]+$ ]] || test_count=0
        [[ "$todo_count" =~ ^[0-9]+$ ]] || todo_count=0
        [[ "$total_mass" =~ ^[0-9]+$ ]] || total_mass=0

        jq --argjson impl_loc "$impl_loc" \
           --argjson test_loc "$test_loc" \
           --argjson test_count "$test_count" \
           --argjson todo_count "$todo_count" \
           --argjson total_mass "$total_mass" \
           --argjson tests_passed "$tests_passed" \
           '.final_metrics.lines_of_code = $impl_loc |
            .final_metrics.test_lines = $test_loc |
            .final_metrics.tests_total = $test_count |
            .final_metrics.todos_remaining = $todo_count |
            .final_metrics.code_mass = $total_mass |
            .final_metrics.tests_passing = $tests_passed' \
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

    echo -e "\n${YELLOW}Select runs to compare (e.g., 1,2,3):${NC} "
    read -r selection

    IFS=',' read -ra indices <<< "$selection"

    # Generate comparison report
    local comparison_file="$RUNS_DIR/comparison-$(date +%Y%m%d-%H%M%S).md"
    local comparison_content="# Experiment Comparison Report\n\n"
    comparison_content+="Generated: $(date -Iseconds)\n\n"
    comparison_content+="## Summary Table\n\n"
    comparison_content+="| Run | Kata | Workflow | Duration | Tests | Mass |\n"
    comparison_content+="|-----|------|----------|----------|-------|------|\n"

    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Comparison Report${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

    for idx in "${indices[@]}"; do
        idx=$((idx - 1))
        if [ $idx -ge 0 ] && [ $idx -lt ${#runs[@]} ]; then
            local run_dir="${runs[$idx]}"
            local run_name=$(basename "$run_dir")

            # Analyze (also saves individual report)
            analyze_single_run "$run_dir"

            # Extract data for comparison table
            if [ -f "$run_dir/metrics.json" ] && command -v jq &> /dev/null; then
                local kata=$(jq -r '.kata' "$run_dir/metrics.json")
                local workflow=$(jq -r '.workflow' "$run_dir/metrics.json")
                local duration=$(jq -r '.duration_seconds // "N/A"' "$run_dir/metrics.json")
                local tests=$(jq -r '.final_metrics.tests_total // "N/A"' "$run_dir/metrics.json")
                local mass=$(jq -r '.final_metrics.code_mass // "N/A"' "$run_dir/metrics.json")

                comparison_content+="| $run_name | $kata | $workflow | ${duration}s | $tests | $mass |\n"
            fi
        fi
    done

    comparison_content+="\n## Detailed Reports\n\n"
    comparison_content+="Individual analysis reports saved in each run directory.\n"

    echo -e "$comparison_content" > "$comparison_file"
    echo -e "\n${GREEN}Saved comparison report to: $comparison_file${NC}"
}

analyze_all() {
    echo -e "\n${CYAN}Analyzing all runs...${NC}"

    local all_report="$RUNS_DIR/all-runs-analysis-$(date +%Y%m%d-%H%M%S).md"
    local all_content="# All Experiments Analysis\n\n"
    all_content+="Generated: $(date -Iseconds)\n\n"
    all_content+="## Summary\n\n"
    all_content+="| Run | Kata | Workflow | Duration | Tests | Todos | Mass | Passed |\n"
    all_content+="|-----|------|----------|----------|-------|-------|------|--------|\n"

    for run in "$RUNS_DIR"/*/; do
        if [ -d "$run" ]; then
            analyze_single_run "$run"

            # Add to summary
            if [ -f "$run/metrics.json" ] && command -v jq &> /dev/null; then
                local run_name=$(basename "$run")
                local kata=$(jq -r '.kata' "$run/metrics.json")
                local workflow=$(jq -r '.workflow' "$run/metrics.json")
                local duration=$(jq -r '.duration_seconds // "N/A"' "$run/metrics.json")
                local tests=$(jq -r '.final_metrics.tests_total // "N/A"' "$run/metrics.json")
                local todos=$(jq -r '.final_metrics.todos_remaining // "N/A"' "$run/metrics.json")
                local mass=$(jq -r '.final_metrics.code_mass // "N/A"' "$run/metrics.json")
                local passed=$(jq -r '.final_metrics.tests_passing // false' "$run/metrics.json")

                local passed_icon="❌"
                if [ "$passed" = "true" ]; then
                    passed_icon="✅"
                fi

                all_content+="| $run_name | $kata | $workflow | ${duration}s | $tests | $todos | $mass | $passed_icon |\n"
            fi

            echo ""
        fi
    done

    echo -e "$all_content" > "$all_report"
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
