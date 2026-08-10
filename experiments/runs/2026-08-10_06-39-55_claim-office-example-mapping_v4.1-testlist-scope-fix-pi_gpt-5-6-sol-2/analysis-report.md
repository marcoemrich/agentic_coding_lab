# Analysis Report: 2026-08-10_06-39-55_claim-office-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol-2

Generated: 2026-08-10T07:37:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.1-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 3429s |
| Started | 2026-08-10T06:39:55+00:00 |
| Ended | 2026-08-10T07:37:06+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 196
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 457
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_06-39-55_claim-office-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_06-39-55_claim-office-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol-2

 ✓ src/claim-office.spec.ts  (43 tests) 8ms
 ✓ src/cli.spec.ts  (3 tests | 2 skipped) 397ms

 Test Files  2 passed (2)
      Tests  44 passed | 2 todo (46)
   Start at  07:37:12
   Duration  819ms (transform 50ms, setup 0ms, collect 68ms, tests 405ms, environment 0ms, prepare 115ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 97% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 101 | ×1 | 101 |
| Invocations | 55 | ×2 | 110 |
| Conditionals | 25 | ×4 | 100 |
| Loops | 0 | ×5 | 0 |
| Assignments | 17 | ×6 | 102 |
| **Total Mass** | | | **413** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 175 |
| Functions | 15 |
| Longest Function | 48 lines |
| Avg LOC/Function | 7.67 |
| Median LOC/Function | 3.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 35 |
| Code Quality | 0 |
| **Total** | **39** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 2.90 | 2 |
| Cognitive (SonarJS) | 13 | 4.86 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11427877 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 76 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 86 |
| Predictions Total | 100 |
| Accuracy | 86% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


