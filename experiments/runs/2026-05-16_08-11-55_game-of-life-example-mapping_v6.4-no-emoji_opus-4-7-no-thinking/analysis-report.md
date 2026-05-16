# Analysis Report: 2026-05-16_08-11-55_game-of-life-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking

Generated: 2026-05-16T08:18:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 417s |
| Started | 2026-05-16T08:11:55+00:00 |
| Ended | 2026-05-16T08:18:53+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 29
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 57
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_08-11-55_game-of-life-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_08-11-55_game-of-life-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 4ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  08:18:54
   Duration  160ms (transform 28ms, setup 0ms, collect 27ms, tests 4ms, environment 0ms, prepare 42ms)
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
| Invocations | 19 | ×2 | 38 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 1 | ×5 | 5 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **147** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 21 |
| Functions | 8 |
| Longest Function | 4 lines |
| Avg LOC/Function | 2.25 |
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
| McCabe (Cyclomatic) | 3 | 1.15 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6701969 |
| Context Utilization | 9% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 83.79s |
| Avg Red Phase | 19.58s |
| Avg Green Phase | 23.95s |
| Avg Refactor Phase | 40.26s |

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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


