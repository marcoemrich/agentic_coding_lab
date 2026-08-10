# Analysis Report: 2026-08-10_08-15-35_game-of-life-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol

Generated: 2026-08-10T08:18:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 190s |
| Started | 2026-08-10T08:15:35+00:00 |
| Ended | 2026-08-10T08:18:46+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 28
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 36
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_08-15-35_game-of-life-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_08-15-35_game-of-life-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol

 ✓ src/game-of-life.spec.ts  (8 tests) 6ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  08:18:47
   Duration  320ms (transform 51ms, setup 0ms, collect 63ms, tests 6ms, environment 0ms, prepare 95ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 33 | ×1 | 33 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 6 | ×5 | 30 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **173** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 25 |
| Functions | 1 |
| Longest Function | 26 lines |
| Avg LOC/Function | 26.00 |
| Median LOC/Function | 26.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 8 |
| Code Quality | 0 |
| **Total** | **10** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 13 | 4.25 | 1 |
| Cognitive (SonarJS) | 19 | 10.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 666714 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 9 |
| Predictions Total | 10 |
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


