# Analysis Report: 2026-05-16_08-43-57_game-of-life-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking

Generated: 2026-05-16T08:53:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 589s |
| Started | 2026-05-16T08:43:57+00:00 |
| Ended | 2026-05-16T08:53:47+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 37
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 59
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_08-43-57_game-of-life-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_08-43-57_game-of-life-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 5ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  08:53:48
   Duration  161ms (transform 23ms, setup 0ms, collect 22ms, tests 5ms, environment 0ms, prepare 51ms)
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
| Invocations | 15 | ×2 | 30 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 1 | ×5 | 5 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **151** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 28 |
| Functions | 7 |
| Longest Function | 4 lines |
| Avg LOC/Function | 2.14 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 2 | 1.18 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6927750 |
| Context Utilization | 9% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 113.99s |
| Avg Red Phase | 30.5s |
| Avg Green Phase | 21.87s |
| Avg Refactor Phase | 61.62s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 20 |
| Predictions Total | 20 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


