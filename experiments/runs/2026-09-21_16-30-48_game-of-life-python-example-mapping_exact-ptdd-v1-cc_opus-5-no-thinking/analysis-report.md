# Analysis Report: 2026-09-21_16-30-48_game-of-life-python-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-21T16:46:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-python-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 374s |
| Started | 2026-09-21T16:30:49+00:00 |
| Ended | 2026-09-21T16:37:03+00:00 |

## Code Metrics

- **Implementation files**: cli.py, game_of_life.py
- **Implementation LOC** (total): 67
- **Test files**: test_cli.py, test_game_of_life.py
- **Test LOC** (total): 178
- **Active tests**: 23
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (23 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-21_16-30-48_game-of-life-python-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 23 items

tests/test_cli.py ......                                                 [ 26%]
tests/test_game_of_life.py .................                             [100%]

================================ tests coverage ================================
_______________ coverage: platform linux, python 3.11.2-final-0 ________________

Coverage JSON written to file coverage.json
============================== 23 passed in 0.19s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 61% |
| Branches | 33% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 16 | ×1 | 16 |
| Invocations | 31 | ×2 | 62 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 8 | ×5 | 40 |
| Assignments | 8 | ×6 | 48 |
| **Total Mass** | | | **186** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 43 |
| Functions | 9 |
| Longest Function | 7 lines |
| Avg LOC/Function | 3.56 |
| Median LOC/Function | 3.00 |
| Imports | 4 |

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
| Total Tokens | 5676867 |
| Context Utilization | 42% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 23 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 46 |
| Predictions Total | 46 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


