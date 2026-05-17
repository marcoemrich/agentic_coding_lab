# Analysis Report: 2026-05-17_17-42-19_game-of-life-example-mapping_v6.5.4-refactor-cut-only_opus-4-7-no-thinking

Generated: 2026-05-17T17:53:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.5.4-refactor-cut-only |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 684s |
| Started | 2026-05-17T17:42:19+00:00 |
| Ended | 2026-05-17T17:53:44+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 31
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 49
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-17_17-42-19_game-of-life-example-mapping_v6.5.4-refactor-cut-only_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-17_17-42-19_game-of-life-example-mapping_v6.5.4-refactor-cut-only_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (8 tests) 3ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  17:53:45
   Duration  157ms (transform 25ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 45ms)
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
| Conditionals | 1 | ×4 | 4 |
| Loops | 4 | ×5 | 20 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **143** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 25 |
| Functions | 3 |
| Longest Function | 18 lines |
| Avg LOC/Function | 7.33 |
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
| McCabe (Cyclomatic) | 4 | 2.00 | 0 |
| Cognitive (SonarJS) | 7 | 4.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8435780 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 80.42s |
| Avg Red Phase | 20.82s |
| Avg Green Phase | 11.08s |
| Avg Refactor Phase | 48.52s |

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


