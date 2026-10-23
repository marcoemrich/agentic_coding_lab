# Analysis Report: 2026-10-23_04-07-29_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3

Generated: 2026-10-23T04:34:48+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | minimax-m3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1634s |
| Started | 2026-10-23T04:07:30+00:00 |
| Ended | 2026-10-23T04:34:48+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 444
- **Test files**: claim.spec.ts, cli.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 838
- **Active tests**: 70
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (70 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_04-07-29_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_04-07-29_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3

 ✓ src/quote.spec.ts  (34 tests) 8ms
 ✓ src/claim.spec.ts  (25 tests) 7ms
 ✓ src/cli.spec.ts  (6 tests) 6ms
 ✓ src/scenario.spec.ts  (5 tests) 6ms

 Test Files  4 passed (4)
      Tests  70 passed (70)
   Start at  04:34:49
   Duration  910ms (transform 94ms, setup 1ms, collect 137ms, tests 27ms, environment 1ms, prepare 266ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 86 | ×1 | 86 |
| Invocations | 101 | ×2 | 202 |
| Conditionals | 26 | ×4 | 104 |
| Loops | 9 | ×5 | 45 |
| Assignments | 78 | ×6 | 468 |
| **Total Mass** | | | **905** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 386 |
| Functions | 20 |
| Longest Function | 27 lines |
| Avg LOC/Function | 10.50 |
| Median LOC/Function | 7.50 |
| Imports | 10 |

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
| McCabe (Cyclomatic) | 6 | 2.52 | 0 |
| Cognitive (SonarJS) | 7 | 3.07 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8602619 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


