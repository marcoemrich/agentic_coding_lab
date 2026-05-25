# Analysis Report: 2026-05-25_15-23-30_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_opus-4-7-portkey

Generated: 2026-05-25T15:34:19+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | opus-4-7-portkey |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 648s |
| Started | 2026-05-25T15:23:30+00:00 |
| Ended | 2026-05-25T15:34:19+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 200
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 426
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_15-23-30_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_opus-4-7-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_15-23-30_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_opus-4-7-portkey

 ✓ src/claim-office.spec.ts  (39 tests) 232ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  15:34:19
   Duration  423ms (transform 43ms, setup 0ms, collect 45ms, tests 232ms, environment 0ms, prepare 54ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 9 | ×5 | 45 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **717** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 179 |
| Functions | 12 |
| Longest Function | 24 lines |
| Avg LOC/Function | 11.08 |
| Median LOC/Function | 10.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 3.07 | 0 |
| Cognitive (SonarJS) | 12 | 3.73 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7901343 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


