# Analysis Report: 2026-10-23_04-12-26_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3

Generated: 2026-10-23T04:59:35+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | minimax-m3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2825s |
| Started | 2026-10-23T04:12:27+00:00 |
| Ended | 2026-10-23T04:59:35+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 362
- **Test files**: claim.spec.ts, cli.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 1097
- **Active tests**: 91
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (90 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_04-12-26_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_04-12-26_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3

 ✓ src/claim.spec.ts  (27 tests) 7ms
 ✓ src/cli.spec.ts  (15 tests) 1428ms
 ✓ src/quote.spec.ts  (33 tests) 7ms
 ✓ src/scenario.spec.ts  (15 tests) 6ms

 Test Files  4 passed (4)
      Tests  90 passed (90)
   Start at  04:59:36
   Duration  2.35s (transform 103ms, setup 0ms, collect 136ms, tests 1.45s, environment 1ms, prepare 269ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 84% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 82 | ×1 | 82 |
| Invocations | 106 | ×2 | 212 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 8 | ×5 | 40 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **762** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 297 |
| Functions | 20 |
| Longest Function | 29 lines |
| Avg LOC/Function | 6.85 |
| Median LOC/Function | 3.00 |
| Imports | 4 |

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
| McCabe (Cyclomatic) | 7 | 2.28 | 0 |
| Cognitive (SonarJS) | 9 | 3.15 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 28512882 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 52 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 104 |
| Predictions Total | 104 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 52 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


