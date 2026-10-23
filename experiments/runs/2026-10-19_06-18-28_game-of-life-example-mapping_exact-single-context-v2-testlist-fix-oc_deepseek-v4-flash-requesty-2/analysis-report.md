# Analysis Report: 2026-10-19_06-18-28_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty-2

Generated: 2026-10-19T06:26:57+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-single-context-v2-testlist-fix-oc |
| Model | deepseek-v4-flash-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 503s |
| Started | 2026-10-19T06:18:29+00:00 |
| Ended | 2026-10-19T06:26:57+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 35
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 39
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_06-18-28_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_06-18-28_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty-2

 ✓ src/game-of-life.spec.ts  (10 tests) 3ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  06:26:57
   Duration  173ms (transform 53ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 13 | ×2 | 26 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 5 | ×5 | 25 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **136** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 30 |
| Functions | 1 |
| Longest Function | 25 lines |
| Avg LOC/Function | 25.00 |
| Median LOC/Function | 25.00 |
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
| McCabe (Cyclomatic) | 8 | 4.50 | 0 |
| Cognitive (SonarJS) | 9 | 9.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2935927 |
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
| Predictions Correct | 8 |
| Predictions Total | 8 |
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


