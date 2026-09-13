# Analysis Report: 2026-09-13_21-22-46_game-of-life-example-mapping_exact-hybrid-v2-testlist-fix-cursor_auto-cursor

Generated: 2026-09-13T21:38:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-hybrid-v2-testlist-fix-cursor |
| Model | auto-cursor |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 917s |
| Started | 2026-09-13T21:22:46+00:00 |
| Ended | 2026-09-13T21:38:05+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 52
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 46
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-13_21-22-46_game-of-life-example-mapping_exact-hybrid-v2-testlist-fix-cursor_auto-cursor
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-13_21-22-46_game-of-life-example-mapping_exact-hybrid-v2-testlist-fix-cursor_auto-cursor

 ✓ src/game-of-life.spec.ts  (8 tests) 4ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  21:38:06
   Duration  178ms (transform 27ms, setup 0ms, collect 25ms, tests 4ms, environment 0ms, prepare 45ms)
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
| Invocations | 25 | ×2 | 50 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 6 | ×5 | 30 |
| Assignments | 9 | ×6 | 54 |
| **Total Mass** | | | **162** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 45 |
| Functions | 4 |
| Longest Function | 21 lines |
| Avg LOC/Function | 9.00 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 5 | 2.60 | 0 |
| Cognitive (SonarJS) | 6 | 3.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1744067 |
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
| Predictions Correct | 10 |
| Predictions Total | 10 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


