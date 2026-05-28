# Analysis Report: 2026-05-28_06-24-10_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-flash-3

Generated: 2026-05-28T06:49:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | deepseek-v4-flash |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1533s |
| Started | 2026-05-28T06:24:10+00:00 |
| Ended | 2026-05-28T06:49:44+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 216
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 514
- **Active tests**: 47
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-28_06-24-10_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-flash-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-28_06-24-10_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-flash-3

 ✓ src/claim-office.spec.ts  (47 tests) 370ms

 Test Files  1 passed (1)
      Tests  47 passed (47)
   Start at  06:49:44
   Duration  562ms (transform 39ms, setup 0ms, collect 40ms, tests 370ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 74% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 72 | ×1 | 72 |
| Invocations | 69 | ×2 | 138 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 9 | ×5 | 45 |
| Assignments | 67 | ×6 | 402 |
| **Total Mass** | | | **737** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 183 |
| Functions | 6 |
| Longest Function | 55 lines |
| Avg LOC/Function | 30.33 |
| Median LOC/Function | 34.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 7 |
| Duplication | 0 |
| Magic Numbers | 8 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 12 | 3.54 | 1 |
| Cognitive (SonarJS) | 15 | 7.83 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7346243 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 4 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


