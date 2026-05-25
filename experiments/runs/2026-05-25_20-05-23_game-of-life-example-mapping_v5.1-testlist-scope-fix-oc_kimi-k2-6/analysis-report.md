# Analysis Report: 2026-05-25_20-05-23_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6

Generated: 2026-05-25T20:36:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | kimi-k2-6 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1878s |
| Started | 2026-05-25T20:05:23+00:00 |
| Ended | 2026-05-25T20:36:42+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 10
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 42
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_20-05-23_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_20-05-23_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6

 ✓ src/game-of-life.spec.ts  (9 tests) 3ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  20:36:43
   Duration  172ms (transform 25ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 47 | ×1 | 47 |
| Invocations | 6 | ×2 | 12 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 0 | ×5 | 0 |
| Assignments | 1 | ×6 | 6 |
| **Total Mass** | | | **85** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 9 |
| Functions | 1 |
| Longest Function | 8 lines |
| Avg LOC/Function | 8.00 |
| Median LOC/Function | 8.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 9 |
| Code Quality | 0 |
| **Total** | **9** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 10.00 | 0 |
| Cognitive (SonarJS) | 7 | 7.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3510423 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 10 |
| Predictions Total | 10 |
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


