# Analysis Report: 2026-05-16_10-09-08_game-of-life-example-mapping_v6.4-no-emoji_sonnet-4-6-no-thinking

Generated: 2026-05-16T10:16:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | sonnet-4-6-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 413s |
| Started | 2026-05-16T10:09:08+00:00 |
| Ended | 2026-05-16T10:16:02+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 15
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 27
- **Active tests**: 5
- **Remaining todos**: 3

## Test Results

**Status**: ✅ All tests passing (5 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_10-09-08_game-of-life-example-mapping_v6.4-no-emoji_sonnet-4-6-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_10-09-08_game-of-life-example-mapping_v6.4-no-emoji_sonnet-4-6-no-thinking

 ✓ src/game-of-life.spec.ts  (8 tests | 3 skipped) 2ms

 Test Files  1 passed (1)
      Tests  5 passed | 3 todo (8)
   Start at  10:16:03
   Duration  150ms (transform 21ms, setup 0ms, collect 20ms, tests 2ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 4 | ×1 | 4 |
| Invocations | 8 | ×2 | 16 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 0 | ×5 | 0 |
| Assignments | 5 | ×6 | 30 |
| **Total Mass** | | | **50** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 12 |
| Functions | 3 |
| Longest Function | 6 lines |
| Avg LOC/Function | 3.67 |
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
| McCabe (Cyclomatic) | 4 | 1.80 | 0 |
| Cognitive (SonarJS) | 2 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3153124 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 92.00s |
| Avg Red Phase | 24.47s |
| Avg Green Phase | 22.89s |
| Avg Refactor Phase | 44.64s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 7 |
| Predictions Total | 8 |
| Accuracy | 87% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


