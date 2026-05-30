# Analysis Report: 2026-05-30_11-17-11_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-7-no-thinking

Generated: 2026-05-30T11:35:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1073s |
| Started | 2026-05-30T11:17:11+00:00 |
| Ended | 2026-05-30T11:35:05+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 36
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 52
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-30_11-17-11_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-30_11-17-11_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 3ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  11:35:05
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
| Constants | 20 | ×1 | 20 |
| Invocations | 15 | ×2 | 30 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 5 | ×5 | 25 |
| Assignments | 14 | ×6 | 84 |
| **Total Mass** | | | **159** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 29 |
| Functions | 5 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.80 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 5 | 1.86 | 0 |
| Cognitive (SonarJS) | 3 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11740349 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 103.60s |
| Avg Red Phase | 27.3s |
| Avg Green Phase | 8.96s |
| Avg Refactor Phase | 67.34s |

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
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


