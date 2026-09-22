# Analysis Report: 2026-09-21_23-21-10_claim-office-python-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex

Generated: 2026-09-22T04:00:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 6407s |
| Started | 2026-09-21T23:21:11+00:00 |
| Ended | 2026-09-22T01:07:58+00:00 |

## Code Metrics

- **Implementation files**: claim.py, cli.py, coverage.py, premium.py
- **Implementation LOC** (total): 308
- **Test files**: test_claim_office.py
- **Test LOC** (total): 319
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-21_23-21-10_claim-office-python-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 40 items

tests/test_claim_office.py ........................................      [100%]

============================== 40 passed in 0.89s ==============================
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 216 | ×1 | 216 |
| Invocations | 108 | ×2 | 216 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 20 | ×5 | 100 |
| Assignments | 37 | ×6 | 222 |
| **Total Mass** | | | **794** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 220 |
| Functions | 37 |
| Longest Function | 18 lines |
| Avg LOC/Function | 4.65 |
| Median LOC/Function | 3.00 |
| Imports | 10 |

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
| Total Tokens | 16652571 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 80 |
| Predictions Total | 80 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 40 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


