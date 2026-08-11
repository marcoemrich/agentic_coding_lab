# Analysis Report: 2026-08-10_15-25-37_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking-2

Generated: 2026-08-10T15:30:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 320s |
| Started | 2026-08-10T15:25:37+00:00 |
| Ended | 2026-08-10T15:30:59+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, cli.ts, parse.ts, policy.ts, premium.ts, quote.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 365
- **Test file**: premium.spec.ts
- **Test file LOC**: 59
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (57 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_15-25-37_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_15-25-37_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking-2

 ✓ src/policy.spec.ts  (20 tests) 5ms
 ✓ src/cli.spec.ts  (7 tests) 2197ms
 ✓ src/quote.spec.ts  (13 tests) 4ms
 ✓ src/scenario.spec.ts  (5 tests) 4ms
 ✓ src/premium.spec.ts  (12 tests) 4ms

 Test Files  5 passed (5)
      Tests  57 passed (57)
   Start at  15:30:59
   Duration  3.00s (transform 64ms, setup 0ms, collect 93ms, tests 2.21s, environment 1ms, prepare 261ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 73% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 79 | ×1 | 79 |
| Invocations | 126 | ×2 | 252 |
| Conditionals | 26 | ×4 | 104 |
| Loops | 16 | ×5 | 80 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **881** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 301 |
| Functions | 20 |
| Longest Function | 24 lines |
| Avg LOC/Function | 8.25 |
| Median LOC/Function | 7.00 |
| Imports | 14 |

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
| McCabe (Cyclomatic) | 6 | 2.23 | 0 |
| Cognitive (SonarJS) | 5 | 2.24 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4426392 |
| Context Utilization | 38% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 14.79s |
| Avg Red Phase | 4.96s |
| Avg Green Phase | 7.21s |
| Avg Refactor Phase | 2.62s |

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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


