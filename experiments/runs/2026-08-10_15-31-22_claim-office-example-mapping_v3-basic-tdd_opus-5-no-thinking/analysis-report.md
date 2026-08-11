# Analysis Report: 2026-08-10_15-31-22_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking

Generated: 2026-08-10T15:35:41+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 258s |
| Started | 2026-08-10T15:31:22+00:00 |
| Ended | 2026-08-10T15:35:41+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, priceList.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 267
- **Test file**: premium.spec.ts
- **Test file LOC**: 99
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_15-31-22_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_15-31-22_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking

 ✓ src/claim.spec.ts  (17 tests) 4ms
 ✓ src/premium.spec.ts  (17 tests) 4ms
 ✓ src/cli.spec.ts  (5 tests) 1542ms

 Test Files  3 passed (3)
      Tests  39 passed (39)
   Start at  15:35:42
   Duration  1.98s (transform 44ms, setup 0ms, collect 56ms, tests 1.55s, environment 0ms, prepare 135ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 73% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 12 | ×5 | 60 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **676** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 209 |
| Functions | 13 |
| Longest Function | 27 lines |
| Avg LOC/Function | 8.38 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 4 | 1.95 | 0 |
| Cognitive (SonarJS) | 4 | 2.30 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3194079 |
| Context Utilization | 34% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 91.50s |
| Avg Red Phase | 24.23s |
| Avg Green Phase | 29.97s |
| Avg Refactor Phase | 37.3s |

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
| Tests Passed Immediately | 0 |


