# Analysis Report: 2026-05-17_17-54-23_game-of-life-example-mapping_v6.5.4-refactor-cut-only_opus-4-7-no-thinking

Generated: 2026-05-17T18:06:33+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.5.4-refactor-cut-only |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 729s |
| Started | 2026-05-17T17:54:23+00:00 |
| Ended | 2026-05-17T18:06:33+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 33
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 51
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-17_17-54-23_game-of-life-example-mapping_v6.5.4-refactor-cut-only_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-17_17-54-23_game-of-life-example-mapping_v6.5.4-refactor-cut-only_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (8 tests) 3ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  18:06:34
   Duration  154ms (transform 26ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 16 | ×2 | 32 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 5 | ×5 | 25 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **150** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 26 |
| Functions | 4 |
| Longest Function | 17 lines |
| Avg LOC/Function | 5.75 |
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
| McCabe (Cyclomatic) | 4 | 1.86 | 0 |
| Cognitive (SonarJS) | 4 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8760506 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 85.48s |
| Avg Red Phase | 22s |
| Avg Green Phase | 13.06s |
| Avg Refactor Phase | 50.42s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


