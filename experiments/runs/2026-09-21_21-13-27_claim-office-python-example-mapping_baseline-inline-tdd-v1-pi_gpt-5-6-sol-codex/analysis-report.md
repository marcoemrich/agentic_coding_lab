# Analysis Report: 2026-09-21_21-13-27_claim-office-python-example-mapping_baseline-inline-tdd-v1-pi_gpt-5-6-sol-codex

Generated: 2026-09-22T03:59:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 320s |
| Started | 2026-09-21T21:13:28+00:00 |
| Ended | 2026-09-21T21:18:48+00:00 |

## Code Metrics

- **Implementation files**: claim_office.py, cli.py
- **Implementation LOC** (total): 222
- **Test files**: test_claim_office.py, test_cli.py
- **Test LOC** (total): 136
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-21_21-13-27_claim-office-python-example-mapping_baseline-inline-tdd-v1-pi_gpt-5-6-sol-codex
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 12 items

tests/test_claim_office.py .........                                     [ 75%]
tests/test_cli.py ...                                                    [100%]

============================== 12 passed in 0.12s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 62% |
| Branches | 51% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 118 | ×1 | 118 |
| Invocations | 115 | ×2 | 230 |
| Conditionals | 28 | ×4 | 112 |
| Loops | 12 | ×5 | 60 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **856** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 182 |
| Functions | 13 |
| Longest Function | 25 lines |
| Avg LOC/Function | 10.46 |
| Median LOC/Function | 8.00 |
| Imports | 8 |

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
| Total Tokens | 249083 |
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


