# Analysis Report: 2026-05-25_20-34-46_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash

Generated: 2026-05-25T20:37:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | gemini-3-5-flash |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 182s |
| Started | 2026-05-25T20:34:46+00:00 |
| Ended | 2026-05-25T20:37:49+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 51
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 47
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_20-34-46_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_20-34-46_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash

 ✓ src/game-of-life.spec.ts  (8 tests) 4ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  20:37:50
   Duration  177ms (transform 25ms, setup 0ms, collect 23ms, tests 4ms, environment 0ms, prepare 56ms)
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
| Invocations | 26 | ×2 | 52 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 7 | ×5 | 35 |
| Assignments | 14 | ×6 | 84 |
| **Total Mass** | | | **198** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 43 |
| Functions | 3 |
| Longest Function | 21 lines |
| Avg LOC/Function | 13.67 |
| Median LOC/Function | 11.00 |
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
| McCabe (Cyclomatic) | 8 | 4.50 | 0 |
| Cognitive (SonarJS) | 8 | 6.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3501664 |
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
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


