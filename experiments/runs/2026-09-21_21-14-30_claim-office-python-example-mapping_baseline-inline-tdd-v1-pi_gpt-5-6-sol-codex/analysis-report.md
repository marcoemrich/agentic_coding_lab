# Analysis Report: 2026-09-21_21-14-30_claim-office-python-example-mapping_baseline-inline-tdd-v1-pi_gpt-5-6-sol-codex

Generated: 2026-09-22T03:59:48+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 334s |
| Started | 2026-09-21T21:14:31+00:00 |
| Ended | 2026-09-21T21:20:05+00:00 |

## Code Metrics

- **Implementation files**: claim_office.py, cli.py
- **Implementation LOC** (total): 200
- **Test files**: test_claim_office.py, test_cli.py
- **Test LOC** (total): 167
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-21_21-14-30_claim-office-python-example-mapping_baseline-inline-tdd-v1-pi_gpt-5-6-sol-codex
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 11 items

tests/test_claim_office.py ........                                      [ 72%]
tests/test_cli.py ...                                                    [100%]

============================== 11 passed in 0.08s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 53% |
| Branches | 47% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 137 | ×1 | 137 |
| Invocations | 113 | ×2 | 226 |
| Conditionals | 33 | ×4 | 132 |
| Loops | 12 | ×5 | 60 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **861** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 164 |
| Functions | 10 |
| Longest Function | 30 lines |
| Avg LOC/Function | 14.30 |
| Median LOC/Function | 12.50 |
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
| Total Tokens | 221189 |
| Context Utilization | 0% |

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


