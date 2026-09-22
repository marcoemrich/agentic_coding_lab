# Analysis Report: 2026-09-22_00-17-13_claim-office-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-22T04:01:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 163s |
| Started | 2026-09-22T00:17:13+00:00 |
| Ended | 2026-09-22T00:19:56+00:00 |

## Code Metrics

- **Implementation files**: claims.py, cli.py, policy.py, premium.py, scenario.py
- **Implementation LOC** (total): 223
- **Test files**: test_base_premium.py, test_claims.py, test_cli.py, test_modifiers.py, test_policy.py, test_premium.py, test_rounding.py, test_scenario.py
- **Test LOC** (total): 408
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (57 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-22_00-17-13_claim-office-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 57 items

tests/test_base_premium.py .......                                       [ 12%]
tests/test_claims.py ........                                            [ 26%]
tests/test_cli.py ...                                                    [ 31%]
tests/test_modifiers.py ......                                           [ 42%]
tests/test_policy.py ............                                        [ 63%]
tests/test_premium.py ...........                                        [ 82%]
tests/test_rounding.py ...                                               [ 87%]
tests/test_scenario.py .......                                           [100%]

============================== 57 passed in 0.12s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 135 | ×1 | 135 |
| Invocations | 93 | ×2 | 186 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 15 | ×5 | 75 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **798** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 168 |
| Functions | 20 |
| Longest Function | 13 lines |
| Avg LOC/Function | 6.10 |
| Median LOC/Function | 5.00 |
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
| Total Tokens | 2505695 |
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


