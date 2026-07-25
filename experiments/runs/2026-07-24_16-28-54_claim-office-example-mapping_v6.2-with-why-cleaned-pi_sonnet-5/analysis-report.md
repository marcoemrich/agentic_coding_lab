# Analysis Report: 2026-07-24_16-28-54_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5

Generated: 2026-07-24T18:24:37+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | sonnet-5 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 6940s |
| Started | 2026-07-24T16:28:54+00:00 |
| Ended | 2026-07-24T18:24:36+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, rounding.ts, types.ts
- **Implementation LOC** (total): 285
- **Test file**: cli.spec.ts
- **Test file LOC**: 108
- **Active tests**: 5
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_16-28-54_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_16-28-54_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5

 ✓ src/quote.spec.ts  (24 tests) 4ms
 ✓ src/claim.spec.ts  (18 tests) 3ms
 ✓ src/cli.spec.ts  (5 tests) 326ms

 Test Files  3 passed (3)
      Tests  47 passed (47)
   Start at  18:24:38
   Duration  754ms (transform 51ms, setup 1ms, collect 61ms, tests 333ms, environment 0ms, prepare 125ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 70% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 14 | ×5 | 70 |
| Assignments | 79 | ×6 | 474 |
| **Total Mass** | | | **816** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 213 |
| Functions | 24 |
| Longest Function | 23 lines |
| Avg LOC/Function | 5.00 |
| Median LOC/Function | 2.00 |
| Imports | 7 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 1.75 | 0 |
| Cognitive (SonarJS) | 5 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4520083 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 69 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 44 |
| Predictions Total | 46 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


