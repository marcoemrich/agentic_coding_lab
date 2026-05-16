# Analysis Report: 2026-05-16_10-16-18_game-of-life-example-mapping_v6.4-no-emoji_sonnet-4-6-no-thinking

Generated: 2026-05-16T10:20:37+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | sonnet-4-6-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 257s |
| Started | 2026-05-16T10:16:19+00:00 |
| Ended | 2026-05-16T10:20:37+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 5
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 20
- **Active tests**: 3
- **Remaining todos**: 6

## Test Results

**Status**: ✅ All tests passing (3 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_10-16-18_game-of-life-example-mapping_v6.4-no-emoji_sonnet-4-6-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_10-16-18_game-of-life-example-mapping_v6.4-no-emoji_sonnet-4-6-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests | 6 skipped) 2ms

 Test Files  1 passed (1)
      Tests  3 passed | 6 todo (9)
   Start at  10:20:38
   Duration  155ms (transform 21ms, setup 0ms, collect 18ms, tests 2ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 0 | ×1 | 0 |
| Invocations | 1 | ×2 | 2 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 0 | ×5 | 0 |
| Assignments | 1 | ×6 | 6 |
| **Total Mass** | | | **8** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 4 |
| Functions | 1 |
| Longest Function | 3 lines |
| Avg LOC/Function | 3.00 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 1 | 1.00 | 0 |
| Cognitive (SonarJS) | 0 | 0 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1941724 |
| Context Utilization | 5% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 74.84s |
| Avg Red Phase | 21.05s |
| Avg Green Phase | 9.83s |
| Avg Refactor Phase | 43.96s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 6 |
| Accuracy | 66% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


