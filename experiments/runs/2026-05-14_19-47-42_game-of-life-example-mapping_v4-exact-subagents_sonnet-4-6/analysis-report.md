# Analysis Report: 2026-05-14_19-47-42_game-of-life-example-mapping_v4-exact-subagents_sonnet-4-6

Generated: 2026-05-14T20:02:37+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4-exact-subagents |
| Model | sonnet-4-6 |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 894s |
| Started | 2026-05-14T19:47:42+00:00 |
| Ended | 2026-05-14T20:02:37+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 45
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 29
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (7 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-14_19-47-42_game-of-life-example-mapping_v4-exact-subagents_sonnet-4-6
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-14_19-47-42_game-of-life-example-mapping_v4-exact-subagents_sonnet-4-6

 ✓ src/game-of-life.spec.ts  (7 tests) 3ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  20:02:37
   Duration  161ms (transform 23ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 13 | ×1 | 13 |
| Invocations | 23 | ×2 | 46 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 3 | ×5 | 15 |
| Assignments | 20 | ×6 | 120 |
| **Total Mass** | | | **206** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 38 |
| Functions | 4 |
| Longest Function | 33 lines |
| Avg LOC/Function | 9.75 |
| Median LOC/Function | 2.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 5 |
| Code Quality | 0 |
| **Total** | **8** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.40 | 0 |
| Cognitive (SonarJS) | 16 | 3.67 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1984762 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 133.66s |
| Avg Red Phase | 43.31s |
| Avg Green Phase | 31.48s |
| Avg Refactor Phase | 58.87s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 8 |
| Predictions Total | 10 |
| Accuracy | 80% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


