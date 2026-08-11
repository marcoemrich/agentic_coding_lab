# Analysis Report: 2026-08-10_15-25-37_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking

Generated: 2026-08-10T15:30:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 316s |
| Started | 2026-08-10T15:25:37+00:00 |
| Ended | 2026-08-10T15:30:55+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, priceList.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 292
- **Test file**: premium.spec.ts
- **Test file LOC**: 186
- **Active tests**: 27
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (55 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_15-25-37_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_15-25-37_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking

 ✓ src/premium.spec.ts  (27 tests) 5ms
 ✓ src/claim.spec.ts  (16 tests) 4ms
 ✓ src/scenario.spec.ts  (8 tests) 4ms
 ✓ src/cli.spec.ts  (4 tests) 1173ms

 Test Files  4 passed (4)
      Tests  55 passed (55)
   Start at  15:30:55
   Duration  1.74s (transform 55ms, setup 0ms, collect 72ms, tests 1.19s, environment 0ms, prepare 175ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 13 | ×5 | 65 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **674** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 232 |
| Functions | 13 |
| Longest Function | 26 lines |
| Avg LOC/Function | 11.54 |
| Median LOC/Function | 10.00 |
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
| McCabe (Cyclomatic) | 5 | 2.05 | 0 |
| Cognitive (SonarJS) | 4 | 2.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4710667 |
| Context Utilization | 38% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 15.45s |
| Avg Red Phase | 4s |
| Avg Green Phase | 7.48s |
| Avg Refactor Phase | 3.97s |

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
| Tests Passed Immediately | 3 |


