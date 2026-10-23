# Analysis Report: 2026-10-23_03-57-25_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash

Generated: 2026-10-23T04:11:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | deepseek-v4-1-flash |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 865s |
| Started | 2026-10-23T03:57:26+00:00 |
| Ended | 2026-10-23T04:11:56+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, priceList.ts, scenario.ts
- **Implementation LOC** (total): 309
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts
- **Test LOC** (total): 329
- **Active tests**: 51
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (51 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_03-57-25_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_03-57-25_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash

 ✓ src/cli.spec.ts  (9 tests) 1474ms
 ✓ src/premium.spec.ts  (27 tests) 10ms
 ✓ src/claim.spec.ts  (15 tests) 5ms

 Test Files  3 passed (3)
      Tests  51 passed (51)
   Start at  04:11:57
   Duration  2.35s (transform 98ms, setup 0ms, collect 122ms, tests 1.49s, environment 1ms, prepare 269ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 68% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 124 | ×2 | 248 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 11 | ×5 | 55 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **744** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 244 |
| Functions | 33 |
| Longest Function | 16 lines |
| Avg LOC/Function | 4.64 |
| Median LOC/Function | 3.00 |
| Imports | 8 |

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
| McCabe (Cyclomatic) | 6 | 1.74 | 0 |
| Cognitive (SonarJS) | 7 | 1.82 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13979879 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 56 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 100 |
| Predictions Total | 102 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 51 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


