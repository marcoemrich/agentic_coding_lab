# Analysis Report: 2026-08-10_07-37-31_game-of-life-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol

Generated: 2026-08-10T07:49:11+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4.1-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 699s |
| Started | 2026-08-10T07:37:31+00:00 |
| Ended | 2026-08-10T07:49:11+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 40
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 73
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_07-37-31_game-of-life-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_07-37-31_game-of-life-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol

 ✓ src/game-of-life.spec.ts  (10 tests) 3ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  07:49:12
   Duration  193ms (transform 30ms, setup 0ms, collect 26ms, tests 3ms, environment 0ms, prepare 55ms)
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
| Conditionals | 0 | ×4 | 0 |
| Loops | 5 | ×5 | 25 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **150** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 33 |
| Functions | 3 |
| Longest Function | 20 lines |
| Avg LOC/Function | 8.67 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 2.00 | 0 |
| Cognitive (SonarJS) | 4 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1353680 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 24 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 19 |
| Predictions Total | 22 |
| Accuracy | 86% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


