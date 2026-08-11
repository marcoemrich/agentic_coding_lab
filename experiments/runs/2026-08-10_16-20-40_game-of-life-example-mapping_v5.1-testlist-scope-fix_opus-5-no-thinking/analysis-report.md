# Analysis Report: 2026-08-10_16-20-40_game-of-life-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-10T16:29:37+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 536s |
| Started | 2026-08-10T16:20:40+00:00 |
| Ended | 2026-08-10T16:29:37+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 64
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 110
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_16-20-40_game-of-life-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_16-20-40_game-of-life-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 4ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  16:29:38
   Duration  167ms (transform 26ms, setup 0ms, collect 28ms, tests 4ms, environment 0ms, prepare 43ms)
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
| Invocations | 32 | ×2 | 64 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 2 | ×5 | 10 |
| Assignments | 14 | ×6 | 84 |
| **Total Mass** | | | **177** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 52 |
| Functions | 10 |
| Longest Function | 7 lines |
| Avg LOC/Function | 3.80 |
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
| McCabe (Cyclomatic) | 2 | 1.12 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14837536 |
| Context Utilization | 74% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 86.27s |
| Avg Red Phase | 21.3s |
| Avg Green Phase | 28.28s |
| Avg Refactor Phase | 36.69s |

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


