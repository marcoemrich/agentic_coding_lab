# Analysis Report: 2026-09-22_00-17-00_game-of-life-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-22T04:01:19+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-python-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 91s |
| Started | 2026-09-22T00:17:00+00:00 |
| Ended | 2026-09-22T00:18:31+00:00 |

## Code Metrics

- **Implementation files**: cli.py, game_of_life.py
- **Implementation LOC** (total): 66
- **Test files**: test_cell.py, test_cli.py, test_neighbours.py, test_next_generation.py
- **Test LOC** (total): 206
- **Active tests**: 27
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (27 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-22_00-17-00_game-of-life-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 27 items

tests/test_cell.py ...                                                   [ 11%]
tests/test_cli.py .......                                                [ 37%]
tests/test_neighbours.py ...                                             [ 48%]
tests/test_next_generation.py ..............                             [100%]

============================== 27 passed in 0.20s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 45% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 31 | ×1 | 31 |
| Invocations | 26 | ×2 | 52 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 7 | ×5 | 35 |
| Assignments | 7 | ×6 | 42 |
| **Total Mass** | | | **172** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 46 |
| Functions | 3 |
| Longest Function | 15 lines |
| Avg LOC/Function | 10.33 |
| Median LOC/Function | 8.00 |
| Imports | 7 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1399787 |
| Context Utilization | 23% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


