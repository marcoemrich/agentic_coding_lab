# Analysis Report: 2026-09-21_21-33-20_claim-office-python-example-mapping_exact-ptdd-v1-pi_gpt-5-6-sol-codex-2

Generated: 2026-09-22T04:00:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1513s |
| Started | 2026-09-21T21:33:21+00:00 |
| Ended | 2026-09-21T21:58:34+00:00 |

## Code Metrics

- **Implementation files**: claim_office.py, cli.py
- **Implementation LOC** (total): 171
- **Test files**: test_claim_office.py
- **Test LOC** (total): 331
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-21_21-33-20_claim-office-python-example-mapping_exact-ptdd-v1-pi_gpt-5-6-sol-codex-2
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 35 items

tests/test_claim_office.py ...................................           [100%]

============================== 35 passed in 0.14s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 67% |
| Branches | 60% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 139 | ×1 | 139 |
| Invocations | 61 | ×2 | 122 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 9 | ×5 | 45 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **676** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 145 |
| Functions | 11 |
| Longest Function | 15 lines |
| Avg LOC/Function | 9.45 |
| Median LOC/Function | 10.00 |
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
| Total Tokens | 6190504 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 70 |
| Predictions Total | 70 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 35 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


