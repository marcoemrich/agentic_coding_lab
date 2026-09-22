# Analysis Report: 2026-09-21_21-30-38_claim-office-python-example-mapping_exact-ptdd-v1-pi_gpt-5-6-sol-codex

Generated: 2026-09-22T04:00:00+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1194s |
| Started | 2026-09-21T21:30:39+00:00 |
| Ended | 2026-09-21T21:50:33+00:00 |

## Code Metrics

- **Implementation files**: claim_office.py, cli.py
- **Implementation LOC** (total): 174
- **Test files**: test_claim_office.py
- **Test LOC** (total): 262
- **Active tests**: 20
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-21_21-30-38_claim-office-python-example-mapping_exact-ptdd-v1-pi_gpt-5-6-sol-codex
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 38 items

tests/test_claim_office.py ......................................        [100%]

============================== 38 passed in 0.17s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 82% |
| Branches | 75% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 93 | ×1 | 93 |
| Invocations | 72 | ×2 | 144 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 9 | ×5 | 45 |
| Assignments | 37 | ×6 | 222 |
| **Total Mass** | | | **548** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 133 |
| Functions | 18 |
| Longest Function | 16 lines |
| Avg LOC/Function | 5.67 |
| Median LOC/Function | 4.00 |
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
| Total Tokens | 3956453 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 20 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 51 |
| Predictions Total | 51 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


