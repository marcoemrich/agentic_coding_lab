# Analysis Report: 2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3

Generated: 2026-10-23T01:51:41+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | minimax-m3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1905s |
| Started | 2026-10-23T01:19:50+00:00 |
| Ended | 2026-10-23T01:51:41+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 314
- **Test files**: claim-office.spec.ts, claim.spec.ts, cli.spec.ts
- **Test LOC** (total): 552
- **Active tests**: 58
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (58 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_01-19-48_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3

 ✓ src/claim.spec.ts  (21 tests) 6ms
 ✓ src/claim-office.spec.ts  (28 tests) 7ms
 ✓ src/cli.spec.ts  (9 tests) 355ms

 Test Files  3 passed (3)
      Tests  58 passed (58)
   Start at  01:51:42
   Duration  1.16s (transform 114ms, setup 0ms, collect 133ms, tests 368ms, environment 0ms, prepare 240ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 76 | ×1 | 76 |
| Invocations | 96 | ×2 | 192 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 11 | ×5 | 55 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **803** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 277 |
| Functions | 18 |
| Longest Function | 29 lines |
| Avg LOC/Function | 7.94 |
| Median LOC/Function | 6.50 |
| Imports | 5 |

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
| McCabe (Cyclomatic) | 7 | 2.64 | 0 |
| Cognitive (SonarJS) | 8 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 507557 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 22 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 64 |
| Predictions Total | 64 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 33 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


