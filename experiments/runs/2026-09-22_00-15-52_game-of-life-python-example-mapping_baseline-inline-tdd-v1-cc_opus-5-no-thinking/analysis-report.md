# Analysis Report: 2026-09-22_00-15-52_game-of-life-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-22T04:01:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-python-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 73s |
| Started | 2026-09-22T00:15:52+00:00 |
| Ended | 2026-09-22T00:17:06+00:00 |

## Code Metrics

- **Implementation files**: cli.py, game_of_life.py
- **Implementation LOC** (total): 54
- **Test files**: test_cli.py, test_game_of_life.py
- **Test LOC** (total): 103
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-22_00-15-52_game-of-life-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 15 items

tests/test_cli.py .....                                                  [ 33%]
tests/test_game_of_life.py ..........                                    [100%]

============================== 15 passed in 0.15s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 64% |
| Branches | 66% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 19 | ×1 | 19 |
| Invocations | 31 | ×2 | 62 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 9 | ×5 | 45 |
| Assignments | 7 | ×6 | 42 |
| **Total Mass** | | | **188** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 36 |
| Functions | 6 |
| Longest Function | 6 lines |
| Avg LOC/Function | 3.83 |
| Median LOC/Function | 4.00 |
| Imports | 5 |

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
| Total Tokens | 1278675 |
| Context Utilization | 22% |

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


