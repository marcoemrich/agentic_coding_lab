# Analysis Report: 2026-05-17_15-59-06_game-of-life-example-mapping_v8b-delayed-refactor-native_opus-4-7-no-thinking

Generated: 2026-05-17T16:00:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v8b-delayed-refactor-native |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 97s |
| Started | 2026-05-17T15:59:06+00:00 |
| Ended | 2026-05-17T16:00:44+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 42
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 164
- **Active tests**: 19
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (19 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-17_15-59-06_game-of-life-example-mapping_v8b-delayed-refactor-native_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-17_15-59-06_game-of-life-example-mapping_v8b-delayed-refactor-native_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (19 tests) 5ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  16:00:44
   Duration  174ms (transform 33ms, setup 0ms, collect 36ms, tests 5ms, environment 0ms, prepare 42ms)
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
| Invocations | 21 | ×2 | 42 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 4 | ×5 | 20 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **147** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 35 |
| Functions | 5 |
| Longest Function | 12 lines |
| Avg LOC/Function | 6.20 |
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
| Total Tokens | 811786 |
| Context Utilization | 5% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 4.93s |
| Avg Red Phase | 3.72s |
| Avg Green Phase | 1.21s |
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


