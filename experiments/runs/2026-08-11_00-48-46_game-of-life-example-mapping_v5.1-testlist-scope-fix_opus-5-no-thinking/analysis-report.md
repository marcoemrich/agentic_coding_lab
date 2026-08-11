# Analysis Report: 2026-08-11_00-48-46_game-of-life-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-11T00:56:17+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 449s |
| Started | 2026-08-11T00:48:46+00:00 |
| Ended | 2026-08-11T00:56:17+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 66
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 97
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_00-48-46_game-of-life-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_00-48-46_game-of-life-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 5ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  00:56:18
   Duration  153ms (transform 25ms, setup 0ms, collect 23ms, tests 5ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 10 | ×1 | 10 |
| Invocations | 35 | ×2 | 70 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 2 | ×5 | 10 |
| Assignments | 18 | ×6 | 108 |
| **Total Mass** | | | **198** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 54 |
| Functions | 9 |
| Longest Function | 9 lines |
| Avg LOC/Function | 5.78 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 3 | 1.32 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13644937 |
| Context Utilization | 70% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 69.09s |
| Avg Red Phase | 19.47s |
| Avg Green Phase | 19.73s |
| Avg Refactor Phase | 29.89s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 20 |
| Predictions Total | 20 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


