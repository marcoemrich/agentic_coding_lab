# Analysis Report: 2026-05-16_10-30-11_game-of-life-example-mapping_v6.4-no-emoji_sonnet-4-6-no-thinking

Generated: 2026-05-16T10:38:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | sonnet-4-6-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 487s |
| Started | 2026-05-16T10:30:11+00:00 |
| Ended | 2026-05-16T10:38:20+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 17
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 30
- **Active tests**: 5
- **Remaining todos**: 4

## Test Results

**Status**: ✅ All tests passing (5 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_10-30-11_game-of-life-example-mapping_v6.4-no-emoji_sonnet-4-6-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_10-30-11_game-of-life-example-mapping_v6.4-no-emoji_sonnet-4-6-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests | 4 skipped) 3ms

 Test Files  1 passed (1)
      Tests  5 passed | 4 todo (9)
   Start at  10:38:21
   Duration  144ms (transform 21ms, setup 0ms, collect 19ms, tests 3ms, environment 0ms, prepare 41ms)
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
| Invocations | 11 | ×2 | 22 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 0 | ×5 | 0 |
| Assignments | 3 | ×6 | 18 |
| **Total Mass** | | | **44** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 13 |
| Functions | 4 |
| Longest Function | 3 lines |
| Avg LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 4 | 1.67 | 0 |
| Cognitive (SonarJS) | 2 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2816759 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 108.40s |
| Avg Red Phase | 26.28s |
| Avg Green Phase | 27s |
| Avg Refactor Phase | 55.12s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 9 |
| Predictions Total | 10 |
| Accuracy | 90% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


