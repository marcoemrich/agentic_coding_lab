# Analysis Report: 2026-05-25_20-05-06_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6

Generated: 2026-05-25T20:20:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | kimi-k2-6 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 914s |
| Started | 2026-05-25T20:05:06+00:00 |
| Ended | 2026-05-25T20:20:22+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 7
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 37
- **Active tests**: 4
- **Remaining todos**: 7

## Test Results

**Status**: ✅ All tests passing (4 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_20-05-06_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_20-05-06_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6

 ✓ src/game-of-life.spec.ts  (11 tests | 7 skipped) 2ms

 Test Files  1 passed (1)
      Tests  4 passed | 7 todo (11)
   Start at  20:20:23
   Duration  155ms (transform 21ms, setup 0ms, collect 18ms, tests 2ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 71% |
| Branches | 75% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 4 | ×1 | 4 |
| Invocations | 3 | ×2 | 6 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 0 | ×5 | 0 |
| Assignments | 1 | ×6 | 6 |
| **Total Mass** | | | **24** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 6 |
| Functions | 1 |
| Longest Function | 5 lines |
| Avg LOC/Function | 5.00 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 3 | 3.00 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1454738 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


