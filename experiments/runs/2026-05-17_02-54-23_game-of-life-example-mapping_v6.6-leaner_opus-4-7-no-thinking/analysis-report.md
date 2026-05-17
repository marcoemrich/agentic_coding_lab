# Analysis Report: 2026-05-17_02-54-23_game-of-life-example-mapping_v6.6-leaner_opus-4-7-no-thinking

Generated: 2026-05-17T03:05:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.6-leaner |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 672s |
| Started | 2026-05-17T02:54:23+00:00 |
| Ended | 2026-05-17T03:05:36+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 29
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 51
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (6 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-17_02-54-23_game-of-life-example-mapping_v6.6-leaner_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-17_02-54-23_game-of-life-example-mapping_v6.6-leaner_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (6 tests) 3ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  03:05:36
   Duration  156ms (transform 24ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 45ms)
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
| Invocations | 19 | ×2 | 38 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 3 | ×5 | 15 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **148** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 22 |
| Functions | 5 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.60 |
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
| McCabe (Cyclomatic) | 3 | 1.20 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7130344 |
| Context Utilization | 9% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 105.19s |
| Avg Red Phase | 29.72s |
| Avg Green Phase | 17.93s |
| Avg Refactor Phase | 57.54s |

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


