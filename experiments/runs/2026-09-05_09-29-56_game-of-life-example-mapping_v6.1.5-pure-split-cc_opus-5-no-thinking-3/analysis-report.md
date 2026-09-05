# Analysis Report: 2026-09-05_09-29-56_game-of-life-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-3

Generated: 2026-09-05T09:37:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1.5-pure-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 457s |
| Started | 2026-09-05T09:29:56+00:00 |
| Ended | 2026-09-05T09:37:38+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 56
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 55
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_09-29-56_game-of-life-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_09-29-56_game-of-life-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-3

 ✓ src/game-of-life.spec.ts  (10 tests) 5ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  09:37:39
   Duration  275ms (transform 56ms, setup 0ms, collect 50ms, tests 5ms, environment 0ms, prepare 74ms)
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
| Loops | 6 | ×5 | 30 |
| Assignments | 18 | ×6 | 108 |
| **Total Mass** | | | **197** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 44 |
| Functions | 6 |
| Longest Function | 13 lines |
| Avg LOC/Function | 5.33 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 4 | 2.00 | 0 |
| Cognitive (SonarJS) | 5 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6866859 |
| Context Utilization | 47% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 103.91s |
| Avg Red Phase | 19.51s |
| Avg Green Phase | 13.52s |
| Avg Refactor Phase | 70.88s |

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
| Tests Passed Immediately | 8 |


