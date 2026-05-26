# Analysis Report: 2026-05-26_02-02-37_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey

Generated: 2026-05-26T02:14:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-7-portkey |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 733s |
| Started | 2026-05-26T02:02:37+00:00 |
| Ended | 2026-05-26T02:14:53+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 56
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 49
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_02-02-37_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_02-02-37_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey

 ✓ src/game-of-life.spec.ts  (8 tests) 5ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  02:14:54
   Duration  342ms (transform 51ms, setup 0ms, collect 54ms, tests 5ms, environment 0ms, prepare 90ms)
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
| Invocations | 18 | ×2 | 36 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 4 | ×5 | 20 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **161** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 46 |
| Functions | 4 |
| Longest Function | 16 lines |
| Avg LOC/Function | 8.00 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 4 | 2.75 | 0 |
| Cognitive (SonarJS) | 7 | 4.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8572623 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 88.46s |
| Avg Red Phase | 30s |
| Avg Green Phase | 11.42s |
| Avg Refactor Phase | 47.04s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


