# Analysis Report: 2026-09-22_00-18-38_claim-office-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-22T04:01:24+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 230s |
| Started | 2026-09-22T00:18:38+00:00 |
| Ended | 2026-09-22T00:22:29+00:00 |

## Code Metrics

- **Implementation files**: claim.py, cli.py, policy.py, premium.py, pricelist.py, scenario.py
- **Implementation LOC** (total): 261
- **Test files**: test_cap.py, test_claim.py, test_cli.py, test_components.py, test_modifiers.py, test_quote.py, test_rounding.py
- **Test LOC** (total): 322
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-22_00-18-38_claim-office-python-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 44 items

tests/test_cap.py .....                                                  [ 11%]
tests/test_claim.py ..........                                           [ 34%]
tests/test_cli.py .....                                                  [ 45%]
tests/test_components.py ......                                          [ 59%]
tests/test_modifiers.py .........                                        [ 79%]
tests/test_quote.py .....                                                [ 90%]
tests/test_rounding.py ....                                              [100%]

============================== 44 passed in 0.15s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 83% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 151 | ×1 | 151 |
| Invocations | 88 | ×2 | 176 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 16 | ×5 | 80 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **793** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 199 |
| Functions | 18 |
| Longest Function | 18 lines |
| Avg LOC/Function | 8.22 |
| Median LOC/Function | 8.50 |
| Imports | 14 |

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
| Total Tokens | 3407582 |
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


