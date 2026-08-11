# Analysis Report: 2026-08-10_15-58-42_game-of-life-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-10T16:04:39+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 355s |
| Started | 2026-08-10T15:58:42+00:00 |
| Ended | 2026-08-10T16:04:39+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 49
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 54
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_15-58-42_game-of-life-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_15-58-42_game-of-life-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 3ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  16:04:40
   Duration  155ms (transform 23ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 25 | ×1 | 25 |
| Invocations | 18 | ×2 | 36 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 6 | ×5 | 30 |
| Assignments | 17 | ×6 | 102 |
| **Total Mass** | | | **193** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 35 |
| Functions | 6 |
| Longest Function | 10 lines |
| Avg LOC/Function | 4.67 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 4 | 1.56 | 0 |
| Cognitive (SonarJS) | 4 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8095497 |
| Context Utilization | 52% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 83.29s |
| Avg Red Phase | 44.44s |
| Avg Green Phase | 12.59s |
| Avg Refactor Phase | 26.26s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 10 |
| Predictions Total | 10 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


