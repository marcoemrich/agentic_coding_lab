# Analysis Report: 2026-08-10_08-20-09_claim-office-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol

Generated: 2026-08-10T08:27:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 412s |
| Started | 2026-08-10T08:20:09+00:00 |
| Ended | 2026-08-10T08:27:02+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 125
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 72
- **Active tests**: 33
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (33 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_08-20-09_claim-office-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_08-20-09_claim-office-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (33 tests) 6ms

 Test Files  1 passed (1)
      Tests  33 passed (33)
   Start at  08:27:03
   Duration  166ms (transform 31ms, setup 0ms, collect 29ms, tests 6ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 44 | ×2 | 88 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 9 | ×5 | 45 |
| Assignments | 34 | ×6 | 204 |
| **Total Mass** | | | **451** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 114 |
| Functions | 4 |
| Longest Function | 24 lines |
| Avg LOC/Function | 15.50 |
| Median LOC/Function | 18.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.29 | 0 |
| Cognitive (SonarJS) | 5 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2373987 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 33 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 28 |
| Predictions Total | 28 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


