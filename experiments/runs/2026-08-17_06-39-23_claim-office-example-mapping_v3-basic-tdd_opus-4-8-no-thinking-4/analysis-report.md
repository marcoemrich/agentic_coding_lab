# Analysis Report: 2026-08-17_06-39-23_claim-office-example-mapping_v3-basic-tdd_opus-4-8-no-thinking-4

Generated: 2026-08-17T10:33:53+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 388s |
| Started | 2026-08-17T06:39:23+00:00 |
| Ended | 2026-08-17T06:45:53+00:00 |

## Code Metrics

- **Implementation files**: basePremium.ts, catalog.ts, claim.ts, cli.ts, premium.ts, rounding.ts, scenario.ts
- **Implementation LOC** (total): 331
- **Test file**: premium.spec.ts
- **Test file LOC**: 73
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (55 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_06-39-23_claim-office-example-mapping_v3-basic-tdd_opus-4-8-no-thinking-4
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_06-39-23_claim-office-example-mapping_v3-basic-tdd_opus-4-8-no-thinking-4

 ✓ src/rounding.spec.ts  (3 tests) 2ms
 ✓ src/basePremium.spec.ts  (8 tests) 3ms
 ✓ src/catalog.spec.ts  (7 tests) 4ms
 ✓ src/premium.spec.ts  (12 tests) 5ms
 ✓ src/cli.spec.ts  (3 tests) 3ms
 ✓ src/claim.spec.ts  (16 tests) 5ms
 ✓ src/scenario.spec.ts  (6 tests) 6ms

 Test Files  7 passed (7)
      Tests  55 passed (55)
   Start at  10:33:54
   Duration  457ms (transform 181ms, setup 1ms, collect 313ms, tests 28ms, environment 1ms, prepare 800ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 79 | ×1 | 79 |
| Invocations | 109 | ×2 | 218 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 9 | ×5 | 45 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **830** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 275 |
| Functions | 24 |
| Longest Function | 14 lines |
| Avg LOC/Function | 6.12 |
| Median LOC/Function | 5.50 |
| Imports | 9 |

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
| McCabe (Cyclomatic) | 5 | 1.74 | 0 |
| Cognitive (SonarJS) | 4 | 1.76 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5506920 |
| Context Utilization | 41% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 34.77s |
| Avg Red Phase | 2.17s |
| Avg Green Phase | 6.1s |
| Avg Refactor Phase | 26.5s |

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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


