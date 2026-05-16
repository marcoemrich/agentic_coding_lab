# Analysis Report: 2026-05-16_10-20-53_game-of-life-example-mapping_v6.4-no-emoji_sonnet-4-6-no-thinking

Generated: 2026-05-16T10:29:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | sonnet-4-6-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 542s |
| Started | 2026-05-16T10:20:53+00:00 |
| Ended | 2026-05-16T10:29:56+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 15
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 38
- **Active tests**: 6
- **Remaining todos**: 3

## Test Results

**Status**: ✅ All tests passing (6 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_10-20-53_game-of-life-example-mapping_v6.4-no-emoji_sonnet-4-6-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_10-20-53_game-of-life-example-mapping_v6.4-no-emoji_sonnet-4-6-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests | 3 skipped) 2ms

 Test Files  1 passed (1)
      Tests  6 passed | 3 todo (9)
   Start at  10:29:56
   Duration  145ms (transform 21ms, setup 0ms, collect 19ms, tests 2ms, environment 0ms, prepare 41ms)
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
| Invocations | 7 | ×2 | 14 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 0 | ×5 | 0 |
| Assignments | 4 | ×6 | 24 |
| **Total Mass** | | | **42** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 13 |
| Functions | 2 |
| Longest Function | 8 lines |
| Avg LOC/Function | 5.00 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 4 | 1.75 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3792668 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 98.28s |
| Avg Red Phase | 25.29s |
| Avg Green Phase | 19.29s |
| Avg Refactor Phase | 53.7s |

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
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


