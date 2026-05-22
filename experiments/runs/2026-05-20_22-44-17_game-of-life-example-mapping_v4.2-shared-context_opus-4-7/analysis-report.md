# Analysis Report: 2026-05-20_22-44-17_game-of-life-example-mapping_v4.2-shared-context_opus-4-7

Generated: 2026-05-20T23:07:19+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 1380s |
| Started | 2026-05-20T22:44:17+00:00 |
| Ended | 2026-05-20T23:07:19+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 33
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 43
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (7 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-20_22-44-17_game-of-life-example-mapping_v4.2-shared-context_opus-4-7
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-20_22-44-17_game-of-life-example-mapping_v4.2-shared-context_opus-4-7

 ✓ src/game-of-life.spec.ts  (7 tests) 3ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  23:07:19
   Duration  166ms (transform 25ms, setup 0ms, collect 24ms, tests 3ms, environment 0ms, prepare 45ms)
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
| Invocations | 13 | ×2 | 26 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 4 | ×5 | 20 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **144** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 27 |
| Functions | 3 |
| Longest Function | 20 lines |
| Avg LOC/Function | 8.00 |
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
| McCabe (Cyclomatic) | 6 | 3.33 | 0 |
| Cognitive (SonarJS) | 6 | 4.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2078006 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 161.69s |
| Avg Red Phase | 47.88s |
| Avg Green Phase | 43.69s |
| Avg Refactor Phase | 70.12s |

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
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


