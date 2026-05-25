# Analysis Report: 2026-05-25_20-52-37_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1

Generated: 2026-05-25T21:02:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | glm-5-1 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 576s |
| Started | 2026-05-25T20:52:37+00:00 |
| Ended | 2026-05-25T21:02:14+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 50
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 46
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_20-52-37_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_20-52-37_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1

 ✓ src/game-of-life.spec.ts  (9 tests) 3ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  21:02:15
   Duration  187ms (transform 25ms, setup 0ms, collect 23ms, tests 3ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 16 | ×1 | 16 |
| Invocations | 25 | ×2 | 50 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 7 | ×5 | 35 |
| Assignments | 21 | ×6 | 126 |
| **Total Mass** | | | **239** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 44 |
| Functions | 5 |
| Longest Function | 15 lines |
| Avg LOC/Function | 8.40 |
| Median LOC/Function | 10.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 3.00 | 0 |
| Cognitive (SonarJS) | 10 | 7.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2091737 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


