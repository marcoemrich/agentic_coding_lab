# Analysis Report: 2026-05-17_01-58-26_game-of-life-example-mapping_v6.6-leaner_opus-4-7-no-thinking

Generated: 2026-05-17T02:42:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.6-leaner |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2656s |
| Started | 2026-05-17T01:58:26+00:00 |
| Ended | 2026-05-17T02:42:43+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 33
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 31
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (6 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-17_01-58-26_game-of-life-example-mapping_v6.6-leaner_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-17_01-58-26_game-of-life-example-mapping_v6.6-leaner_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (6 tests) 3ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  02:42:44
   Duration  145ms (transform 22ms, setup 0ms, collect 20ms, tests 3ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 19 | ×1 | 19 |
| Invocations | 14 | ×2 | 28 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 4 | ×5 | 20 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **141** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 27 |
| Functions | 3 |
| Longest Function | 20 lines |
| Avg LOC/Function | 8.00 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 6 | 3.33 | 0 |
| Cognitive (SonarJS) | 10 | 6.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6366330 |
| Context Utilization | 9% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 76.03s |
| Avg Red Phase | 21.7s |
| Avg Green Phase | 12.9s |
| Avg Refactor Phase | 41.43s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 12 |
| Predictions Total | 12 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


