# Analysis Report: 2026-10-19_00-53-41_claim-office-example-mapping_exact-hybrid-v4.2-phase-continuation-pi_minimax-m3

Generated: 2026-10-19T04:18:19+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v4.2-phase-continuation-pi |
| Model | minimax-m3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 12274s |
| Started | 2026-10-19T00:53:42+00:00 |
| Ended | 2026-10-19T04:18:19+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, node-types.d.ts, quote.ts
- **Implementation LOC** (total): 337
- **Test files**: claim.spec.ts, cli.spec.ts, quote.spec.ts
- **Test LOC** (total): 626
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_00-53-41_claim-office-example-mapping_exact-hybrid-v4.2-phase-continuation-pi_minimax-m3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_00-53-41_claim-office-example-mapping_exact-hybrid-v4.2-phase-continuation-pi_minimax-m3

 ✓ src/claim.spec.ts  (18 tests) 4ms
 ✓ src/quote.spec.ts  (21 tests) 3ms
 ✓ src/cli.spec.ts  (4 tests) 4ms

 Test Files  3 passed (3)
      Tests  43 passed (43)
   Start at  04:18:20
   Duration  429ms (transform 55ms, setup 1ms, collect 57ms, tests 11ms, environment 0ms, prepare 130ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 81 | ×1 | 81 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 12 | ×5 | 60 |
| Assignments | 80 | ×6 | 480 |
| **Total Mass** | | | **859** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 268 |
| Functions | 20 |
| Longest Function | 28 lines |
| Avg LOC/Function | 6.15 |
| Median LOC/Function | 2.00 |
| Imports | 3 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.32 | 0 |
| Cognitive (SonarJS) | 7 | 2.47 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 25823669 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 70 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
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


