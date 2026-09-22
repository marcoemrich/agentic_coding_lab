# Analysis Report: 2026-09-22_01-57-46_claim-office-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-22T04:01:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 235s |
| Started | 2026-09-22T01:57:46+00:00 |
| Ended | 2026-09-22T02:01:42+00:00 |

## Code Metrics

- **Implementation files**: claim.py, cli.py, policy.py, pricelist.py, quote.py, rounding.py, scenario.py
- **Implementation LOC** (total): 267
- **Test files**: test_cap.py, test_claim.py, test_cli.py, test_errors.py, test_item_modifiers.py, test_policy.py, test_policy_modifiers.py, test_quote.py, test_scenario.py
- **Test LOC** (total): 428
- **Active tests**: 53
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (53 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-22_01-57-46_claim-office-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 53 items

tests/test_cap.py ....                                                   [  7%]
tests/test_claim.py ........                                             [ 22%]
tests/test_cli.py ...                                                    [ 28%]
tests/test_errors.py ......                                              [ 39%]
tests/test_item_modifiers.py .....                                       [ 49%]
tests/test_policy.py ......                                              [ 60%]
tests/test_policy_modifiers.py ........                                  [ 75%]
tests/test_quote.py .........                                            [ 92%]
tests/test_scenario.py ....                                              [100%]

============================== 53 passed in 0.10s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 154 | ×1 | 154 |
| Invocations | 103 | ×2 | 206 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 18 | ×5 | 90 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **850** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 193 |
| Functions | 26 |
| Longest Function | 12 lines |
| Avg LOC/Function | 5.15 |
| Median LOC/Function | 4.50 |
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
| Total Tokens | 3247285 |
| Context Utilization | 34% |

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


