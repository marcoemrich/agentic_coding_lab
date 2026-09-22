# Analysis Report: 2026-09-22_00-48-08_claim-office-python-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-09-22T04:01:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5, <synthetic> |
| Thinking | unknown |
| Duration | 1719s |
| Started | 2026-09-22T00:48:08+00:00 |
| Ended | 2026-09-22T01:16:47+00:00 |

## Code Metrics

- **Implementation files**: claim_office.py
- **Implementation LOC** (total): 27
- **Test files**: test_claim_office.py
- **Test LOC** (total): 306
- **Active tests**: 51
- **Remaining todos**: 47

## Test Results

**Status**: ✅ All tests passing (4 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-22_00-48-08_claim-office-python-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 51 items

tests/test_claim_office.py ....sssssssssssssssssssssssssssssssssssssssss [ 88%]
ssssss                                                                   [100%]

======================== 4 passed, 47 skipped in 0.04s =========================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 7 | ×2 | 14 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 2 | ×5 | 10 |
| Assignments | 4 | ×6 | 24 |
| **Total Mass** | | | **69** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 17 |
| Functions | 3 |
| Longest Function | 7 lines |
| Avg LOC/Function | 4.33 |
| Median LOC/Function | 3.00 |
| Imports | 1 |

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
| Total Tokens | 2187331 |
| Context Utilization | 36% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 50.40s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 50.4s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 9 |
| Predictions Total | 9 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


