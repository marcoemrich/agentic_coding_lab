# Analysis Report: 2026-05-30_12-56-42_game-of-life-example-mapping_v6.5-end-refactor_opus-4-7-no-thinking

Generated: 2026-05-30T13:18:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.5-end-refactor |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1285s |
| Started | 2026-05-30T12:56:42+00:00 |
| Ended | 2026-05-30T13:18:08+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 40
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 57
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-30_12-56-42_game-of-life-example-mapping_v6.5-end-refactor_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-30_12-56-42_game-of-life-example-mapping_v6.5-end-refactor_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 5ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  13:18:09
   Duration  205ms (transform 27ms, setup 0ms, collect 25ms, tests 5ms, environment 0ms, prepare 57ms)
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
| Assignments | 17 | ×6 | 102 |
| **Total Mass** | | | **169** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 30 |
| Functions | 7 |
| Longest Function | 6 lines |
| Avg LOC/Function | 2.57 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 3 | 1.22 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12781792 |
| Context Utilization | 14% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 124.38s |
| Avg Red Phase | 29.15s |
| Avg Green Phase | 12.06s |
| Avg Refactor Phase | 83.17s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 18 |
| Predictions Total | 18 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


