# Analysis Report: 2026-05-16_02-41-54_game-of-life-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking

Generated: 2026-05-16T02:49:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 484s |
| Started | 2026-05-16T02:41:54+00:00 |
| Ended | 2026-05-16T02:49:59+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 36
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 57
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_02-41-54_game-of-life-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_02-41-54_game-of-life-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (8 tests) 2ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  02:50:00
   Duration  149ms (transform 23ms, setup 0ms, collect 21ms, tests 2ms, environment 0ms, prepare 43ms)
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
| Invocations | 17 | ×2 | 34 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 4 | ×5 | 20 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **145** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 30 |
| Functions | 4 |
| Longest Function | 19 lines |
| Avg LOC/Function | 6.50 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 6 | 2.40 | 0 |
| Cognitive (SonarJS) | 7 | 4.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6066870 |
| Context Utilization | 9% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 106.84s |
| Avg Red Phase | 24.87s |
| Avg Green Phase | 28.67s |
| Avg Refactor Phase | 53.3s |

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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


