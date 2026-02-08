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

analyze_single_run() {
    local run_dir=$1

    if [ ! -d "$run_dir" ]; then
        echo -e "${RED}Run directory not found: $run_dir${NC}"
        exit 1
    fi

    local run_name=$(basename "$run_dir")
    echo -e "\n${CYAN}Analyzing: $run_name${NC}"
    echo -e "${CYAN}─────────────────────────────────────────────────${NC}"

    # Basic info from metrics.json
    if [ -f "$run_dir/metrics.json" ]; then
        if command -v jq &> /dev/null; then
            local kata=$(jq -r '.kata' "$run_dir/metrics.json")
            local workflow=$(jq -r '.workflow' "$run_dir/metrics.json")
            local duration=$(jq -r '.duration_seconds // "N/A"' "$run_dir/metrics.json")

            echo -e "${YELLOW}Kata:${NC} $kata"
            echo -e "${YELLOW}Workflow:${NC} $workflow"
            echo -e "${YELLOW}Duration:${NC} ${duration}s"
        fi
    fi

    # Code metrics
    echo -e "\n${YELLOW}Code Metrics:${NC}"

    # Lines of code
    if [ -f "$run_dir/src/string-calculator.ts" ]; then
        local impl_loc=$(wc -l < "$run_dir/src/string-calculator.ts")
        echo -e "  Implementation LOC: $impl_loc"
    else
        echo -e "  Implementation: ${RED}Not found${NC}"
    fi

    # Test file
    if [ -f "$run_dir/src/string-calculator.spec.ts" ]; then
        local test_loc=$(wc -l < "$run_dir/src/string-calculator.spec.ts")
        local test_count=$(grep -c "it(" "$run_dir/src/string-calculator.spec.ts" 2>/dev/null || echo "0")
        local todo_count=$(grep -c "it.todo" "$run_dir/src/string-calculator.spec.ts" 2>/dev/null || echo "0")

        echo -e "  Test file LOC: $test_loc"
        echo -e "  Active tests: $test_count"
        echo -e "  Remaining todos: $todo_count"
    else
        echo -e "  Tests: ${RED}Not found${NC}"
    fi

    # Run tests if possible
    echo -e "\n${YELLOW}Test Results:${NC}"
    if [ -f "$run_dir/package.json" ] && [ -d "$run_dir/node_modules" ]; then
        (cd "$run_dir" && pnpm test 2>&1) || echo -e "  ${RED}Tests failed or not runnable${NC}"
    else
        echo -e "  ${YELLOW}Run 'pnpm install' in $run_dir to enable test execution${NC}"
    fi

    # Calculate APP mass if implementation exists
    if [ -f "$run_dir/src/string-calculator.ts" ]; then
        echo -e "\n${YELLOW}APP Mass Estimation:${NC}"
        local constants=$(grep -oE '\b[0-9]+\b|"[^"]*"|'\''[^'\'']*'\''' "$run_dir/src/string-calculator.ts" 2>/dev/null | wc -l || echo 0)
        local invocations=$(grep -oE '\w+\s*\(' "$run_dir/src/string-calculator.ts" 2>/dev/null | wc -l || echo 0)
        local conditionals=$(grep -cE '\bif\b|\bswitch\b|\?.*:' "$run_dir/src/string-calculator.ts" 2>/dev/null || echo 0)
        local loops=$(grep -cE '\bfor\b|\bwhile\b|\.map\(|\.reduce\(|\.forEach\(' "$run_dir/src/string-calculator.ts" 2>/dev/null || echo 0)
        local assignments=$(grep -cE '[^=!<>]=[^=]|\+\+|--' "$run_dir/src/string-calculator.ts" 2>/dev/null || echo 0)

        local mass=$((constants * 1 + invocations * 2 + conditionals * 4 + loops * 5 + assignments * 6))

        echo -e "  Constants: $constants (×1 = $constants)"
        echo -e "  Invocations: $invocations (×2 = $((invocations * 2)))"
        echo -e "  Conditionals: $conditionals (×4 = $((conditionals * 4)))"
        echo -e "  Loops: $loops (×5 = $((loops * 5)))"
        echo -e "  Assignments: $assignments (×6 = $((assignments * 6)))"
        echo -e "  ${GREEN}Estimated Total Mass: $mass${NC}"
    fi
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

    echo -e "\n${YELLOW}Select runs to compare (e.g., 1,2):${NC} "
    read -r selection

    IFS=',' read -ra indices <<< "$selection"
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Comparison Report${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

    for idx in "${indices[@]}"; do
        idx=$((idx - 1))
        if [ $idx -ge 0 ] && [ $idx -lt ${#runs[@]} ]; then
            analyze_single_run "${runs[$idx]}"
        fi
    done
}

# Main
print_header

if [ -n "$1" ]; then
    # Analyze specific run
    analyze_single_run "$1"
else
    # Interactive mode
    echo -e "\n${YELLOW}Options:${NC}"
    echo "  1) Analyze single run"
    echo "  2) Compare runs"
    echo -e "\n${YELLOW}Select option:${NC} "
    read -r option

    case $option in
        1)
            echo -e "\n${CYAN}Available Runs:${NC}"
            local i=1
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
        *)
            echo -e "${RED}Invalid option${NC}"
            ;;
    esac
fi

echo -e "\n${GREEN}Done!${NC}"
