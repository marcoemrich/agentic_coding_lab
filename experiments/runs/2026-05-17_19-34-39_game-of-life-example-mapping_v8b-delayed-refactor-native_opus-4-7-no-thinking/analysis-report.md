# Analysis Report: 2026-05-17_19-34-39_game-of-life-example-mapping_v8b-delayed-refactor-native_opus-4-7-no-thinking

Generated: 2026-05-17T19:36:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v8b-delayed-refactor-native |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 82s |
| Started | 2026-05-17T19:34:39+00:00 |
| Ended | 2026-05-17T19:36:02+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 42
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 142
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (17 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-17_19-34-39_game-of-life-example-mapping_v8b-delayed-refactor-native_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-17_19-34-39_game-of-life-example-mapping_v8b-delayed-refactor-native_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (17 tests) 5ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  19:36:03
   Duration  167ms (transform 28ms, setup 0ms, collect 28ms, tests 5ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 22 | ×1 | 22 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 4 | ×5 | 20 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **152** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 35 |
| Functions | 5 |
| Longest Function | 12 lines |
| Avg LOC/Function | 6.00 |
| Median LOC/Function | 4.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.50 | 0 |
| Cognitive (SonarJS) | 4 | 3.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 800719 |
| Context Utilization | 5% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 5.03s |
| Avg Red Phase | 3.08s |
| Avg Green Phase | 1.95s |
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


