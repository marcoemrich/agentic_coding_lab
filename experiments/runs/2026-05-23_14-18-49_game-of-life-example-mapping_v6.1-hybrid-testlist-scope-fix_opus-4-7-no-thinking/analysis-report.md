# Analysis Report: 2026-05-23_14-18-49_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-no-thinking

Generated: 2026-05-23T14:25:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 426s |
| Started | 2026-05-23T14:18:49+00:00 |
| Ended | 2026-05-23T14:25:56+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 38
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 57
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_14-18-49_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_14-18-49_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 3ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  14:25:57
   Duration  159ms (transform 26ms, setup 1ms, collect 24ms, tests 3ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 20 | ×1 | 20 |
| Invocations | 14 | ×2 | 28 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 4 | ×5 | 20 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **142** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 32 |
| Functions | 3 |
| Longest Function | 25 lines |
| Avg LOC/Function | 9.67 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 6 | 3.33 | 0 |
| Cognitive (SonarJS) | 10 | 6.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6710055 |
| Context Utilization | 9% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 101.33s |
| Avg Red Phase | 27.53s |
| Avg Green Phase | 17.21s |
| Avg Refactor Phase | 56.59s |

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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


