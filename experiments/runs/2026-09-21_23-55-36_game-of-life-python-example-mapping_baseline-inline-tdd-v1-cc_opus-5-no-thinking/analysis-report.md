# Analysis Report: 2026-09-21_23-55-36_game-of-life-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-22T04:00:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-python-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 68s |
| Started | 2026-09-21T23:55:37+00:00 |
| Ended | 2026-09-21T23:56:45+00:00 |

## Code Metrics

- **Implementation files**: cli.py, game_of_life.py
- **Implementation LOC** (total): 48
- **Test files**: test_cli.py, test_game_of_life.py
- **Test LOC** (total): 87
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-21_23-55-36_game-of-life-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 13 items

tests/test_cli.py .....                                                  [ 38%]
tests/test_game_of_life.py ........                                      [100%]

============================== 13 passed in 0.16s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 56% |
| Branches | 60% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 16 | ×1 | 16 |
| Invocations | 24 | ×2 | 48 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 8 | ×5 | 40 |
| Assignments | 7 | ×6 | 42 |
| **Total Mass** | | | **162** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 36 |
| Functions | 3 |
| Longest Function | 11 lines |
| Avg LOC/Function | 7.33 |
| Median LOC/Function | 6.00 |
| Imports | 6 |

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
| Total Tokens | 1131654 |
| Context Utilization | 21% |

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


