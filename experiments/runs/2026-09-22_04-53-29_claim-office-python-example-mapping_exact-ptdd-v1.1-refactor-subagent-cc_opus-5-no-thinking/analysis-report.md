# Analysis Report: 2026-09-22_04-53-29_claim-office-python-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-09-22T05:52:00+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3511s |
| Started | 2026-09-22T04:53:29+00:00 |
| Ended | 2026-09-22T05:52:00+00:00 |

## Code Metrics

- **Implementation files**: claim.py, cli.py, quote.py, rejection.py, rounding.py
- **Implementation LOC** (total): 520
- **Test files**: test_claim_office.py
- **Test LOC** (total): 433
- **Active tests**: 52
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-22_04-53-29_claim-office-python-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 52 items

tests/test_claim_office.py ............................................. [ 86%]
.......                                                                  [100%]

============================== 52 passed in 0.13s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 70% |
| Branches | 70% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 218 | ×1 | 218 |
| Invocations | 151 | ×2 | 302 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 34 | ×5 | 170 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **1078** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 366 |
| Functions | 46 |
| Longest Function | 13 lines |
| Avg LOC/Function | 6.28 |
| Median LOC/Function | 6.50 |
| Imports | 16 |

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
| Total Tokens | 44164316 |
| Context Utilization | 118% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 77 |
| Avg Cycle Time | 45.33s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 45.33s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 102 |
| Predictions Total | 102 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 51 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


