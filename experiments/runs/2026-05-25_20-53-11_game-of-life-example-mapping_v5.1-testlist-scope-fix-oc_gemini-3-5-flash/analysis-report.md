# Analysis Report: 2026-05-25_20-53-11_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash

Generated: 2026-05-25T20:55:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | gemini-3-5-flash |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 148s |
| Started | 2026-05-25T20:53:11+00:00 |
| Ended | 2026-05-25T20:55:40+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 68
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 67
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_20-53-11_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_20-53-11_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash

 ✓ src/game-of-life.spec.ts  (9 tests) 3ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  20:55:41
   Duration  159ms (transform 24ms, setup 0ms, collect 23ms, tests 3ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 27 | ×1 | 27 |
| Invocations | 27 | ×2 | 54 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 9 | ×5 | 45 |
| Assignments | 18 | ×6 | 108 |
| **Total Mass** | | | **254** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 50 |
| Functions | 4 |
| Longest Function | 12 lines |
| Avg LOC/Function | 5.50 |
| Median LOC/Function | 4.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 4.50 | 0 |
| Cognitive (SonarJS) | 18 | 14.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3177378 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
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


