# Analysis Report: 2026-05-17_19-36-16_game-of-life-example-mapping_v8b-delayed-refactor-native_opus-4-7-no-thinking

Generated: 2026-05-17T19:37:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v8b-delayed-refactor-native |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 92s |
| Started | 2026-05-17T19:36:16+00:00 |
| Ended | 2026-05-17T19:37:49+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 45
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 190
- **Active tests**: 22
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (22 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-17_19-36-16_game-of-life-example-mapping_v8b-delayed-refactor-native_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-17_19-36-16_game-of-life-example-mapping_v8b-delayed-refactor-native_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (22 tests) 5ms

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  19:37:50
   Duration  171ms (transform 32ms, setup 0ms, collect 30ms, tests 5ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 23 | ×2 | 46 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 4 | ×5 | 20 |
| Assignments | 9 | ×6 | 54 |
| **Total Mass** | | | **145** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 38 |
| Functions | 5 |
| Longest Function | 12 lines |
| Avg LOC/Function | 6.40 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 2.17 | 0 |
| Cognitive (SonarJS) | 4 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 854626 |
| Context Utilization | 5% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 4.68s |
| Avg Red Phase | 3.4s |
| Avg Green Phase | 1.28s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


