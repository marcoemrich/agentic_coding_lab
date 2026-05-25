# Analysis Report: 2026-05-25_20-20-40_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1-2

Generated: 2026-05-25T20:38:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | glm-5-1 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1059s |
| Started | 2026-05-25T20:20:40+00:00 |
| Ended | 2026-05-25T20:38:20+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 44
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 46
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_20-20-40_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_20-20-40_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1-2

 ✓ src/game-of-life.spec.ts  (9 tests) 4ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  20:38:21
   Duration  168ms (transform 24ms, setup 0ms, collect 22ms, tests 4ms, environment 0ms, prepare 49ms)
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
| Invocations | 23 | ×2 | 46 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 6 | ×5 | 30 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **174** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 37 |
| Functions | 3 |
| Longest Function | 27 lines |
| Avg LOC/Function | 11.67 |
| Median LOC/Function | 6.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.60 | 0 |
| Cognitive (SonarJS) | 12 | 6.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3388331 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 4 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


