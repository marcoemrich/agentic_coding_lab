# Analysis Report: 2026-08-10_16-29-54_game-of-life-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-10T16:36:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 390s |
| Started | 2026-08-10T16:29:54+00:00 |
| Ended | 2026-08-10T16:36:26+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 60
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 55
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_16-29-54_game-of-life-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_16-29-54_game-of-life-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (12 tests) 6ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  16:36:27
   Duration  180ms (transform 28ms, setup 0ms, collect 26ms, tests 6ms, environment 0ms, prepare 60ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 19 | ×1 | 19 |
| Invocations | 33 | ×2 | 66 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 2 | ×5 | 10 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **185** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 48 |
| Functions | 11 |
| Longest Function | 7 lines |
| Avg LOC/Function | 3.36 |
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
| McCabe (Cyclomatic) | 2 | 1.06 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11983433 |
| Context Utilization | 59% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 85.67s |
| Avg Red Phase | 20.25s |
| Avg Green Phase | 20.59s |
| Avg Refactor Phase | 44.83s |

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
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


