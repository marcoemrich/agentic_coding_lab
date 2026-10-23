# Analysis Report: 2026-10-19_04-57-51_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty

Generated: 2026-10-19T04:59:50+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-single-context-v2-testlist-fix-oc |
| Model | deepseek-v4-pro-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 116s |
| Started | 2026-10-19T04:57:52+00:00 |
| Ended | 2026-10-19T04:59:50+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 50
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 43
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_04-57-51_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_04-57-51_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty

 ✓ src/game-of-life.spec.ts  (9 tests) 3ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  04:59:51
   Duration  152ms (transform 28ms, setup 0ms, collect 20ms, tests 3ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 27 | ×1 | 27 |
| Invocations | 24 | ×2 | 48 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 7 | ×5 | 35 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **214** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 42 |
| Functions | 4 |
| Longest Function | 21 lines |
| Avg LOC/Function | 9.25 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 8 | 2.83 | 0 |
| Cognitive (SonarJS) | 8 | 4.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2310110 |
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


