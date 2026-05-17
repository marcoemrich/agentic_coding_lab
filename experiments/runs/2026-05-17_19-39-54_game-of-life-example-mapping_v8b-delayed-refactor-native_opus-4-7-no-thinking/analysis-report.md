# Analysis Report: 2026-05-17_19-39-54_game-of-life-example-mapping_v8b-delayed-refactor-native_opus-4-7-no-thinking

Generated: 2026-05-17T19:41:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v8b-delayed-refactor-native |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 110s |
| Started | 2026-05-17T19:39:54+00:00 |
| Ended | 2026-05-17T19:41:45+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 49
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 123
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-17_19-39-54_game-of-life-example-mapping_v8b-delayed-refactor-native_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-17_19-39-54_game-of-life-example-mapping_v8b-delayed-refactor-native_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (14 tests) 4ms

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  19:41:46
   Duration  153ms (transform 27ms, setup 0ms, collect 24ms, tests 4ms, environment 0ms, prepare 42ms)
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
| Invocations | 25 | ×2 | 50 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 4 | ×5 | 20 |
| Assignments | 9 | ×6 | 54 |
| **Total Mass** | | | **150** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 41 |
| Functions | 6 |
| Longest Function | 13 lines |
| Avg LOC/Function | 6.00 |
| Median LOC/Function | 3.50 |
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
| McCabe (Cyclomatic) | 4 | 2.00 | 0 |
| Cognitive (SonarJS) | 5 | 3.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1053595 |
| Context Utilization | 5% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 3.75s |
| Avg Red Phase | 2.63s |
| Avg Green Phase | 1.12s |
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
| Tests Passed Immediately | 1 |


