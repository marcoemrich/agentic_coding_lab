# Analysis Report: 2026-09-21_23-56-52_claim-office-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-22T04:00:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 149s |
| Started | 2026-09-21T23:56:52+00:00 |
| Ended | 2026-09-21T23:59:22+00:00 |

## Code Metrics

- **Implementation files**: catalogue.py, cli.py, errors.py, office.py, policy.py, scenario.py
- **Implementation LOC** (total): 252
- **Test files**: test_base_premium.py, test_claims.py, test_cli.py, test_premium.py, test_scenario.py
- **Test LOC** (total): 352
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-21_23-56-52_claim-office-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 50 items

tests/test_base_premium.py .......                                       [ 14%]
tests/test_claims.py ...................                                 [ 52%]
tests/test_cli.py ...                                                    [ 58%]
tests/test_premium.py .................                                  [ 92%]
tests/test_scenario.py ....                                              [100%]

============================== 50 passed in 0.13s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 135 | ×1 | 135 |
| Invocations | 107 | ×2 | 214 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 12 | ×5 | 60 |
| Assignments | 70 | ×6 | 420 |
| **Total Mass** | | | **913** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 203 |
| Functions | 19 |
| Longest Function | 19 lines |
| Avg LOC/Function | 7.84 |
| Median LOC/Function | 7.00 |
| Imports | 19 |

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
| Total Tokens | 1899073 |
| Context Utilization | 30% |

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


