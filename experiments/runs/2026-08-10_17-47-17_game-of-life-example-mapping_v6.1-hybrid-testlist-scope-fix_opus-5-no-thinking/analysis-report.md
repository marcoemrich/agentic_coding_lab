# Analysis Report: 2026-08-10_17-47-17_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-10T17:59:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 722s |
| Started | 2026-08-10T17:47:17+00:00 |
| Ended | 2026-08-10T17:59:20+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 51
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 78
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_17-47-17_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_17-47-17_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (13 tests) 4ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  17:59:21
   Duration  155ms (transform 27ms, setup 0ms, collect 24ms, tests 4ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 15 | ×1 | 15 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 4 | ×5 | 20 |
| Assignments | 22 | ×6 | 132 |
| **Total Mass** | | | **211** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 38 |
| Functions | 6 |
| Longest Function | 6 lines |
| Avg LOC/Function | 2.83 |
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
| McCabe (Cyclomatic) | 3 | 1.36 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10565106 |
| Context Utilization | 56% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 107.27s |
| Avg Red Phase | 19.92s |
| Avg Green Phase | 17.86s |
| Avg Refactor Phase | 69.49s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 9 |


