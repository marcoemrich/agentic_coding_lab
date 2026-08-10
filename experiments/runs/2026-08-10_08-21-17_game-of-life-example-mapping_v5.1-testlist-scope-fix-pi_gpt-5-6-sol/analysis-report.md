# Analysis Report: 2026-08-10_08-21-17_game-of-life-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol

Generated: 2026-08-10T08:24:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 166s |
| Started | 2026-08-10T08:21:17+00:00 |
| Ended | 2026-08-10T08:24:05+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 28
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 37
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_08-21-17_game-of-life-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_08-21-17_game-of-life-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol

 ✓ src/game-of-life.spec.ts  (9 tests) 4ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  08:24:06
   Duration  244ms (transform 38ms, setup 0ms, collect 35ms, tests 4ms, environment 0ms, prepare 77ms)
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
| Invocations | 17 | ×2 | 34 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 3 | ×5 | 15 |
| Assignments | 7 | ×6 | 42 |
| **Total Mass** | | | **109** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 23 |
| Functions | 2 |
| Longest Function | 18 lines |
| Avg LOC/Function | 10.00 |
| Median LOC/Function | 10.00 |
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
| McCabe (Cyclomatic) | 3 | 1.80 | 0 |
| Cognitive (SonarJS) | 3 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 666951 |
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
| Predictions Total | 11 |
| Accuracy | 90% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


