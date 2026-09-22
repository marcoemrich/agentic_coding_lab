# Analysis Report: 2026-09-22_02-08-36_claim-office-python-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-22T04:01:57+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1357s |
| Started | 2026-09-22T02:08:36+00:00 |
| Ended | 2026-09-22T02:31:14+00:00 |

## Code Metrics

- **Implementation files**: claim_office.py, cli.py
- **Implementation LOC** (total): 283
- **Test files**: test_claim_office.py
- **Test LOC** (total): 635
- **Active tests**: 62
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (62 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-22_02-08-36_claim-office-python-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 62 items

tests/test_claim_office.py ............................................. [ 72%]
.................                                                        [100%]

============================== 62 passed in 0.13s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 163 | ×1 | 163 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 19 | ×5 | 95 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **898** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 219 |
| Functions | 18 |
| Longest Function | 25 lines |
| Avg LOC/Function | 8.78 |
| Median LOC/Function | 8.00 |
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
| Total Tokens | 29366975 |
| Context Utilization | 87% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 92 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 116 |
| Predictions Total | 118 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 59 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 33 |


