# Analysis Report: 2026-09-21_21-13-15_claim-office-python-example-mapping_baseline-inline-tdd-v1-pi_gpt-5-6-sol-codex

Generated: 2026-09-22T03:59:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 282s |
| Started | 2026-09-21T21:13:16+00:00 |
| Ended | 2026-09-21T21:17:58+00:00 |

## Code Metrics

- **Implementation files**: claim_office.py, cli.py
- **Implementation LOC** (total): 201
- **Test files**: test_claim_office.py, test_cli.py
- **Test LOC** (total): 222
- **Active tests**: 19
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (29 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-21_21-13-15_claim-office-python-example-mapping_baseline-inline-tdd-v1-pi_gpt-5-6-sol-codex
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 29 items

tests/test_claim_office.py ..........................                    [ 89%]
tests/test_cli.py ...                                                    [100%]

============================== 29 passed in 0.11s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 80% |
| Branches | 77% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 127 | ×1 | 127 |
| Invocations | 108 | ×2 | 216 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 11 | ×5 | 55 |
| Assignments | 58 | ×6 | 348 |
| **Total Mass** | | | **838** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 163 |
| Functions | 13 |
| Longest Function | 33 lines |
| Avg LOC/Function | 10.62 |
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
| Total Tokens | 172355 |
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


