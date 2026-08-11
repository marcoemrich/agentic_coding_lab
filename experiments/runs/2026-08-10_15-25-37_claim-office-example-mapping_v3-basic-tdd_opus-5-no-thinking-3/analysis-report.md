# Analysis Report: 2026-08-10_15-25-37_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking-3

Generated: 2026-08-10T15:31:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 323s |
| Started | 2026-08-10T15:25:37+00:00 |
| Ended | 2026-08-10T15:31:02+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, priceList.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 280
- **Test file**: premium.spec.ts
- **Test file LOC**: 132
- **Active tests**: 22
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_15-25-37_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_15-25-37_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking-3

 ✓ src/claim.spec.ts  (20 tests) 5ms
 ✓ src/premium.spec.ts  (22 tests) 4ms
 ✓ src/cli.spec.ts  (6 tests) 693ms

 Test Files  3 passed (3)
      Tests  48 passed (48)
   Start at  15:31:03
   Duration  1.18s (transform 60ms, setup 0ms, collect 72ms, tests 702ms, environment 0ms, prepare 154ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 76% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 73 | ×2 | 146 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 13 | ×5 | 65 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **694** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 217 |
| Functions | 11 |
| Longest Function | 19 lines |
| Avg LOC/Function | 10.27 |
| Median LOC/Function | 10.00 |
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
| McCabe (Cyclomatic) | 5 | 1.90 | 0 |
| Cognitive (SonarJS) | 5 | 2.22 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4684897 |
| Context Utilization | 38% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 51.32s |
| Avg Red Phase | 22.97s |
| Avg Green Phase | 19.42s |
| Avg Refactor Phase | 8.93s |

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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


