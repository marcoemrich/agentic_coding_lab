# Analysis Report: 2026-09-22_01-30-09_claim-office-python-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-09-22T04:01:50+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-python-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 6635s |
| Started | 2026-09-22T01:30:10+00:00 |
| Ended | 2026-09-22T03:20:45+00:00 |

## Code Metrics

- **Implementation files**: claim_office.py, cli.py
- **Implementation LOC** (total): 644
- **Test files**: test_claim_office.py
- **Test LOC** (total): 1203
- **Active tests**: 60
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (60 passed)

```
============================= test session starts ==============================
platform linux -- Python 3.11.2, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/experimenter/experiments/runs/2026-09-22_01-30-09_claim-office-python-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking
configfile: pyproject.toml
testpaths: tests
plugins: cov-7.1.0
collected 60 items

tests/test_claim_office.py ............................................. [ 75%]
...............                                                          [100%]

============================== 60 passed in 0.21s ==============================
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 213 | ×1 | 213 |
| Invocations | 139 | ×2 | 278 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 28 | ×5 | 140 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **1015** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 489 |
| Functions | 46 |
| Longest Function | 25 lines |
| Avg LOC/Function | 8.83 |
| Median LOC/Function | 9.00 |
| Imports | 8 |

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
| Total Tokens | 56729800 |
| Context Utilization | 154% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 98 |
| Avg Cycle Time | 80.73s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 80.73s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 120 |
| Predictions Total | 120 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 60 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


