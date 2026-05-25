# Analysis Report: 2026-05-25_20-08-32_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6

Generated: 2026-05-25T20:22:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | kimi-k2-6 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 845s |
| Started | 2026-05-25T20:08:32+00:00 |
| Ended | 2026-05-25T20:22:38+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 42
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 64
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_20-08-32_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_20-08-32_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6

 ✓ src/game-of-life.spec.ts  (9 tests) 5ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  20:22:39
   Duration  167ms (transform 25ms, setup 0ms, collect 23ms, tests 5ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 18 | ×1 | 18 |
| Invocations | 30 | ×2 | 60 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 12 | ×5 | 60 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **240** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 34 |
| Functions | 2 |
| Longest Function | 29 lines |
| Avg LOC/Function | 19.50 |
| Median LOC/Function | 19.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 12 | 5.00 | 1 |
| Cognitive (SonarJS) | 20 | 15.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1471861 |
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
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


