# Analysis Report: 2026-10-19_06-18-28_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty

Generated: 2026-10-19T06:25:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-single-context-v2-testlist-fix-oc |
| Model | deepseek-v4-flash-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 436s |
| Started | 2026-10-19T06:18:29+00:00 |
| Ended | 2026-10-19T06:25:51+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 51
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 31
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_06-18-28_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_06-18-28_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty

 ✓ src/game-of-life.spec.ts  (9 tests) 5ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  06:25:52
   Duration  173ms (transform 48ms, setup 0ms, collect 22ms, tests 5ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 24 | ×1 | 24 |
| Invocations | 23 | ×2 | 46 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 5 | ×5 | 25 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **199** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 44 |
| Functions | 4 |
| Longest Function | 20 lines |
| Avg LOC/Function | 8.00 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 10 | 4.00 | 0 |
| Cognitive (SonarJS) | 10 | 4.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2622091 |
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
| Predictions Correct | 14 |
| Predictions Total | 14 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


