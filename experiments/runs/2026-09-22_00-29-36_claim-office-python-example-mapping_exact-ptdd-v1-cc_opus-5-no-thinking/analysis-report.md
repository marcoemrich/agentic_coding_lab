# Analysis Report: 2026-09-22_00-29-36_claim-office-python-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-22T04:01:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 968s |
| Started | 2026-09-22T00:29:36+00:00 |
| Ended | 2026-09-22T00:45:44+00:00 |

## Code Metrics

- **Implementation files**: claim_office.py, cli.py
- **Implementation LOC** (total): 268
- **Test files**: test_claim_office.py, test_cli.py
- **Test LOC** (total): 528
- **Active tests**: 58
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (58 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-22_00-29-36_claim-office-python-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 58 items

tests/test_claim_office.py ............................................. [ 77%]
......                                                                   [ 87%]
tests/test_cli.py .......                                                [100%]

============================== 58 passed in 0.24s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 136 | ×1 | 136 |
| Invocations | 95 | ×2 | 190 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 10 | ×5 | 50 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **754** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 193 |
| Functions | 29 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.00 |
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
| Total Tokens | 22133853 |
| Context Utilization | 76% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 89 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 116 |
| Predictions Total | 116 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 58 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 31 |


