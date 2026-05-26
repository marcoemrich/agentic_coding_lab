# Analysis Report: 2026-05-26_02-04-49_game-of-life-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey

Generated: 2026-05-26T02:11:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.2-with-why-cleaned-oc |
| Model | opus-4-7-portkey |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 383s |
| Started | 2026-05-26T02:04:49+00:00 |
| Ended | 2026-05-26T02:11:14+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 42
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 75
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_02-04-49_game-of-life-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_02-04-49_game-of-life-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey

 ✓ src/game-of-life.spec.ts  (9 tests) 5ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  02:11:15
   Duration  316ms (transform 56ms, setup 0ms, collect 52ms, tests 5ms, environment 0ms, prepare 84ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 20 | ×1 | 20 |
| Invocations | 16 | ×2 | 32 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 4 | ×5 | 20 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **158** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 36 |
| Functions | 4 |
| Longest Function | 13 lines |
| Avg LOC/Function | 8.00 |
| Median LOC/Function | 8.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 2.75 | 0 |
| Cognitive (SonarJS) | 3 | 2.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1753222 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 1 |
| Accuracy | 0% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


