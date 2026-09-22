# Analysis Report: 2026-09-22_04-53-29_claim-office-python-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-2

Generated: 2026-09-22T05:55:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3713s |
| Started | 2026-09-22T04:53:29+00:00 |
| Ended | 2026-09-22T05:55:22+00:00 |

## Code Metrics

- **Implementation files**: claim_office.py, cli.py
- **Implementation LOC** (total): 580
- **Test files**: test_claim_office.py
- **Test LOC** (total): 441
- **Active tests**: 56
- **Remaining todos**: 1

## Test Results

**Status**: ✅ All tests passing (56 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-22_04-53-29_claim-office-python-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-2
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 56 items

tests/test_claim_office.py ............................................. [ 80%]
...........                                                              [100%]

============================== 56 passed in 0.17s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 79% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 232 | ×1 | 232 |
| Invocations | 138 | ×2 | 276 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 34 | ×5 | 170 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **1108** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 428 |
| Functions | 48 |
| Longest Function | 20 lines |
| Avg LOC/Function | 7.50 |
| Median LOC/Function | 5.50 |
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
| Total Tokens | 52193714 |
| Context Utilization | 129% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 56 |
| Avg Cycle Time | 44.23s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 44.23s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 112 |
| Predictions Total | 112 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 56 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


