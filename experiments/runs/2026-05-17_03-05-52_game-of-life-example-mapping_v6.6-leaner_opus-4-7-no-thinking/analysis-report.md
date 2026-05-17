# Analysis Report: 2026-05-17_03-05-52_game-of-life-example-mapping_v6.6-leaner_opus-4-7-no-thinking

Generated: 2026-05-17T03:16:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.6-leaner |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 622s |
| Started | 2026-05-17T03:05:52+00:00 |
| Ended | 2026-05-17T03:16:15+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 32
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 34
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (6 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-17_03-05-52_game-of-life-example-mapping_v6.6-leaner_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-17_03-05-52_game-of-life-example-mapping_v6.6-leaner_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (6 tests) 3ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  03:16:16
   Duration  149ms (transform 22ms, setup 0ms, collect 20ms, tests 3ms, environment 0ms, prepare 43ms)
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
| Invocations | 13 | ×2 | 26 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 4 | ×5 | 20 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **134** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 27 |
| Functions | 2 |
| Longest Function | 22 lines |
| Avg LOC/Function | 12.00 |
| Median LOC/Function | 12.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 4.50 | 0 |
| Cognitive (SonarJS) | 12 | 12.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6566197 |
| Context Utilization | 9% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 98.41s |
| Avg Red Phase | 24.73s |
| Avg Green Phase | 14.23s |
| Avg Refactor Phase | 59.45s |

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


