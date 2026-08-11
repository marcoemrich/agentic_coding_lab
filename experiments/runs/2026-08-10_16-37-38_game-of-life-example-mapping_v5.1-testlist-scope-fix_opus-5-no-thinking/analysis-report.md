# Analysis Report: 2026-08-10_16-37-38_game-of-life-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-10T16:44:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 423s |
| Started | 2026-08-10T16:37:38+00:00 |
| Ended | 2026-08-10T16:44:43+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 39
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 116
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_16-37-38_game-of-life-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_16-37-38_game-of-life-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 3ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  16:44:44
   Duration  161ms (transform 25ms, setup 0ms, collect 23ms, tests 3ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 16 | ×2 | 32 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 2 | ×5 | 10 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **128** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 30 |
| Functions | 5 |
| Longest Function | 7 lines |
| Avg LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.29 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10451616 |
| Context Utilization | 62% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 85.67s |
| Avg Red Phase | 31.6s |
| Avg Green Phase | 22.1s |
| Avg Refactor Phase | 31.97s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 12 |
| Predictions Total | 12 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


