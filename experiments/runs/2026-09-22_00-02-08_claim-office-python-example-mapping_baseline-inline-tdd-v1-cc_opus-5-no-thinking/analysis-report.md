# Analysis Report: 2026-09-22_00-02-08_claim-office-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-22T04:01:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 215s |
| Started | 2026-09-22T00:02:08+00:00 |
| Ended | 2026-09-22T00:05:44+00:00 |

## Code Metrics

- **Implementation files**: catalogue.py, claim.py, cli.py, errors.py, policy.py, premium.py, scenario.py
- **Implementation LOC** (total): 288
- **Test files**: test_base_premium.py, test_claim_matching.py, test_claim_payout.py, test_cli.py, test_damage_payout.py, test_errors.py, test_insurance_sum.py, test_item_surcharges.py, test_premium.py, test_scenario.py, test_spec_examples.py
- **Test LOC** (total): 532
- **Active tests**: 62
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (65 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-22_00-02-08_claim-office-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 65 items

tests/test_base_premium.py ............                                  [ 18%]
tests/test_claim_matching.py .......                                     [ 29%]
tests/test_claim_payout.py ....                                          [ 35%]
tests/test_cli.py .....                                                  [ 43%]
tests/test_damage_payout.py ........                                     [ 55%]
tests/test_errors.py .                                                   [ 56%]
tests/test_insurance_sum.py .....                                        [ 64%]
tests/test_item_surcharges.py ......                                     [ 73%]
tests/test_premium.py .......                                            [ 84%]
tests/test_scenario.py .....                                             [ 92%]
tests/test_spec_examples.py .....                                        [100%]

============================== 65 passed in 0.18s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 127 | ×1 | 127 |
| Invocations | 105 | ×2 | 210 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 16 | ×5 | 80 |
| Assignments | 58 | ×6 | 348 |
| **Total Mass** | | | **833** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 221 |
| Functions | 20 |
| Longest Function | 21 lines |
| Avg LOC/Function | 7.85 |
| Median LOC/Function | 6.00 |
| Imports | 20 |

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
| Total Tokens | 3025016 |
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


