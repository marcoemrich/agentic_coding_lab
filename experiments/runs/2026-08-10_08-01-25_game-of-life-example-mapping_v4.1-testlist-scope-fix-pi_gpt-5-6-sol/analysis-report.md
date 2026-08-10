# Analysis Report: 2026-08-10_08-01-25_game-of-life-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol

Generated: 2026-08-10T08:16:48+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4.1-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 922s |
| Started | 2026-08-10T08:01:25+00:00 |
| Ended | 2026-08-10T08:16:48+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 28
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 67
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_08-01-25_game-of-life-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_08-01-25_game-of-life-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol

 ✓ src/game-of-life.spec.ts  (10 tests) 5ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  08:16:49
   Duration  212ms (transform 28ms, setup 1ms, collect 26ms, tests 5ms, environment 0ms, prepare 61ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 13 | ×1 | 13 |
| Invocations | 18 | ×2 | 36 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 5 | ×5 | 25 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **138** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 24 |
| Functions | 2 |
| Longest Function | 19 lines |
| Avg LOC/Function | 12.50 |
| Median LOC/Function | 12.50 |
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
| McCabe (Cyclomatic) | 7 | 2.29 | 0 |
| Cognitive (SonarJS) | 12 | 5.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1516151 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 17 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 22 |
| Accuracy | 72% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


