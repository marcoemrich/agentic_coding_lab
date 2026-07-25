# Analysis Report: 2026-07-24_19-42-02_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3

Generated: 2026-07-24T23:23:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | minimax-m3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 13297s |
| Started | 2026-07-24T19:42:02+00:00 |
| Ended | 2026-07-24T23:23:40+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 378
- **Test file**: claim.spec.ts
- **Test file LOC**: 169
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_19-42-02_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_19-42-02_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3

 ✓ src/quote.spec.ts  (27 tests) 4ms
 ✓ src/claim.spec.ts  (11 tests) 3ms
 ✓ src/scenario.spec.ts  (9 tests) 4ms

 Test Files  3 passed (3)
      Tests  47 passed (47)
   Start at  23:23:41
   Duration  434ms (transform 57ms, setup 0ms, collect 68ms, tests 11ms, environment 0ms, prepare 126ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 94 | ×2 | 188 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 19 | ×5 | 95 |
| Assignments | 58 | ×6 | 348 |
| **Total Mass** | | | **748** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 271 |
| Functions | 15 |
| Longest Function | 27 lines |
| Avg LOC/Function | 9.00 |
| Median LOC/Function | 7.00 |
| Imports | 6 |

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
| McCabe (Cyclomatic) | 7 | 2.67 | 0 |
| Cognitive (SonarJS) | 8 | 2.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2563807 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 19 |
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
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


