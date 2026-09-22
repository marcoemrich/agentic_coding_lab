# Analysis Report: 2026-09-22_00-00-55_game-of-life-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-22T04:01:04+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-python-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 66s |
| Started | 2026-09-22T00:00:55+00:00 |
| Ended | 2026-09-22T00:02:01+00:00 |

## Code Metrics

- **Implementation files**: cli.py, game_of_life.py
- **Implementation LOC** (total): 49
- **Test files**: test_cli.py, test_game_of_life.py
- **Test LOC** (total): 71
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-22_00-00-55_game-of-life-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 10 items

tests/test_cli.py ...                                                    [ 30%]
tests/test_game_of_life.py .......                                       [100%]

============================== 10 passed in 0.10s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 52% |
| Branches | 33% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 17 | ×1 | 17 |
| Invocations | 27 | ×2 | 54 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 8 | ×5 | 40 |
| Assignments | 8 | ×6 | 48 |
| **Total Mass** | | | **175** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 35 |
| Functions | 4 |
| Longest Function | 7 lines |
| Avg LOC/Function | 5.50 |
| Median LOC/Function | 5.50 |
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
| Total Tokens | 1219893 |
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


