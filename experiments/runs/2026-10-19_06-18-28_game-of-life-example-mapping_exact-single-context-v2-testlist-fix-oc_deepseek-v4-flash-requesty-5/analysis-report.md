# Analysis Report: 2026-10-19_06-18-28_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty-5

Generated: 2026-10-19T06:25:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-single-context-v2-testlist-fix-oc |
| Model | deepseek-v4-flash-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 424s |
| Started | 2026-10-19T06:18:29+00:00 |
| Ended | 2026-10-19T06:25:38+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 35
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 34
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_06-18-28_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_06-18-28_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty-5

 ✓ src/game-of-life.spec.ts  (10 tests) 4ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  06:25:38
   Duration  195ms (transform 32ms, setup 0ms, collect 23ms, tests 4ms, environment 0ms, prepare 58ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 12 | ×1 | 12 |
| Invocations | 21 | ×2 | 42 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 7 | ×5 | 35 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **175** |

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
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 4.00 | 0 |
| Cognitive (SonarJS) | 9 | 5.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2816074 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 3 |
| Predictions Total | 3 |
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


