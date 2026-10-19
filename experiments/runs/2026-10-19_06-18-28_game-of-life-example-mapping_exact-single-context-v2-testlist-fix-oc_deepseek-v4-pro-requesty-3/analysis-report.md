# Analysis Report: 2026-10-19_06-18-28_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty-3

Generated: 2026-10-19T06:20:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-single-context-v2-testlist-fix-oc |
| Model | deepseek-v4-pro-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 132s |
| Started | 2026-10-19T06:18:29+00:00 |
| Ended | 2026-10-19T06:20:47+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 35
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 41
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_06-18-28_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_06-18-28_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty-3

 ✓ src/game-of-life.spec.ts  (10 tests) 4ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  06:20:48
   Duration  178ms (transform 31ms, setup 0ms, collect 21ms, tests 4ms, environment 0ms, prepare 52ms)
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
| Invocations | 16 | ×2 | 32 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 5 | ×5 | 25 |
| Assignments | 9 | ×6 | 54 |
| **Total Mass** | | | **136** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 29 |
| Functions | 2 |
| Longest Function | 21 lines |
| Avg LOC/Function | 12.00 |
| Median LOC/Function | 12.00 |
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
| McCabe (Cyclomatic) | 8 | 3.33 | 0 |
| Cognitive (SonarJS) | 9 | 9.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1483042 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
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


