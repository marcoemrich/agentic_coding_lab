# Analysis Report: 2026-09-22_03-00-49_claim-office-python-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-09-22T04:02:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3390s |
| Started | 2026-09-22T03:00:49+00:00 |
| Ended | 2026-09-22T03:57:20+00:00 |

## Code Metrics

- **Implementation files**: claim_office.py, claim_settlement.py, cli.py, premium_rating.py, tariff.py
- **Implementation LOC** (total): 440
- **Test files**: test_claim_office.py
- **Test LOC** (total): 392
- **Active tests**: 47
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (49 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-22_03-00-49_claim-office-python-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 49 items

tests/test_claim_office.py ............................................. [ 91%]
....                                                                     [100%]

============================== 49 passed in 0.17s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 78% |
| Branches | 78% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 187 | ×1 | 187 |
| Invocations | 134 | ×2 | 268 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 22 | ×5 | 110 |
| Assignments | 58 | ×6 | 348 |
| **Total Mass** | | | **973** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 321 |
| Functions | 41 |
| Longest Function | 16 lines |
| Avg LOC/Function | 6.07 |
| Median LOC/Function | 3.00 |
| Imports | 13 |

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
| Total Tokens | 34288639 |
| Context Utilization | 105% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 47 |
| Avg Cycle Time | 50.48s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 50.48s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 94 |
| Predictions Total | 94 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 47 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


