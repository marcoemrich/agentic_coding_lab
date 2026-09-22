# Analysis Report: 2026-09-22_05-55-30_claim-office-python-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-09-22T06:32:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2232s |
| Started | 2026-09-22T05:55:30+00:00 |
| Ended | 2026-09-22T06:32:42+00:00 |

## Code Metrics

- **Implementation files**: claim_office.py, cli.py
- **Implementation LOC** (total): 359
- **Test files**: test_claim_office.py
- **Test LOC** (total): 667
- **Active tests**: 55
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (55 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-22_05-55-30_claim-office-python-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 55 items

tests/test_claim_office.py ............................................. [ 81%]
..........                                                               [100%]

============================== 55 passed in 0.13s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 81% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 159 | ×1 | 159 |
| Invocations | 106 | ×2 | 212 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 21 | ×5 | 105 |
| Assignments | 58 | ×6 | 348 |
| **Total Mass** | | | **892** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 267 |
| Functions | 29 |
| Longest Function | 20 lines |
| Avg LOC/Function | 8.62 |
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
| Total Tokens | 25278875 |
| Context Utilization | 94% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 70 |
| Avg Cycle Time | 55.90s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 55.9s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 92 |
| Predictions Total | 92 |
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


