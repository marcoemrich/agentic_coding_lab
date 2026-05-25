# Analysis Report: 2026-05-25_20-20-40_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1

Generated: 2026-05-25T20:34:29+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | glm-5-1 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 828s |
| Started | 2026-05-25T20:20:40+00:00 |
| Ended | 2026-05-25T20:34:29+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 54
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 61
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_20-20-40_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_20-20-40_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1

 ✓ src/game-of-life.spec.ts  (10 tests) 3ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  20:34:30
   Duration  171ms (transform 26ms, setup 0ms, collect 24ms, tests 3ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 23 | ×1 | 23 |
| Invocations | 23 | ×2 | 46 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 4 | ×5 | 20 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **187** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 46 |
| Functions | 3 |
| Longest Function | 32 lines |
| Avg LOC/Function | 14.67 |
| Median LOC/Function | 9.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 4.00 | 0 |
| Cognitive (SonarJS) | 19 | 11.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3379102 |
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
| Predictions Correct | 8 |
| Predictions Total | 8 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


