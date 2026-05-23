# Analysis Report: 2026-05-23_14-38-06_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-no-thinking

Generated: 2026-05-23T14:49:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 676s |
| Started | 2026-05-23T14:38:06+00:00 |
| Ended | 2026-05-23T14:49:23+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 42
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 48
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_14-38-06_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_14-38-06_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 3ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  14:49:24
   Duration  160ms (transform 25ms, setup 0ms, collect 23ms, tests 3ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 16 | ×2 | 32 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 5 | ×5 | 25 |
| Assignments | 14 | ×6 | 84 |
| **Total Mass** | | | **174** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 34 |
| Functions | 5 |
| Longest Function | 12 lines |
| Avg LOC/Function | 5.80 |
| Median LOC/Function | 2.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 2.17 | 0 |
| Cognitive (SonarJS) | 3 | 2.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6573577 |
| Context Utilization | 10% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 135.81s |
| Avg Red Phase | 30.3s |
| Avg Green Phase | 27.77s |
| Avg Refactor Phase | 77.74s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 17 |
| Predictions Total | 18 |
| Accuracy | 94% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


