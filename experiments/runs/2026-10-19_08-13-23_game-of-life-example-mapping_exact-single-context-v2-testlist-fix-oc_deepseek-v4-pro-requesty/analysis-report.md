# Analysis Report: 2026-10-19_08-13-23_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty

Generated: 2026-10-19T08:15:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-single-context-v2-testlist-fix-oc |
| Model | deepseek-v4-pro-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 129s |
| Started | 2026-10-19T08:13:23+00:00 |
| Ended | 2026-10-19T08:15:34+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 28
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 34
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (7 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_08-13-23_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_08-13-23_game-of-life-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty

 ✓ src/game-of-life.spec.ts  (7 tests) 3ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  08:15:35
   Duration  168ms (transform 29ms, setup 0ms, collect 20ms, tests 3ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 15 | ×1 | 15 |
| Invocations | 18 | ×2 | 36 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 6 | ×5 | 30 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **155** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 24 |
| Functions | 2 |
| Longest Function | 25 lines |
| Avg LOC/Function | 13.50 |
| Median LOC/Function | 13.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 3.75 | 1 |
| Cognitive (SonarJS) | 17 | 9.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1191941 |
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
| Predictions Correct | 2 |
| Predictions Total | 3 |
| Accuracy | 66% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


