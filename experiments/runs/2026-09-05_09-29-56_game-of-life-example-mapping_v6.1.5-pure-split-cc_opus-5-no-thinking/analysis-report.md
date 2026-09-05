# Analysis Report: 2026-09-05_09-29-56_game-of-life-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking

Generated: 2026-09-05T09:43:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1.5-pure-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 838s |
| Started | 2026-09-05T09:29:56+00:00 |
| Ended | 2026-09-05T09:43:58+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 51
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 156
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_09-29-56_game-of-life-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_09-29-56_game-of-life-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 9ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  09:43:58
   Duration  282ms (transform 49ms, setup 0ms, collect 52ms, tests 9ms, environment 0ms, prepare 75ms)
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
| Invocations | 16 | ×2 | 32 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 5 | ×5 | 25 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **163** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 39 |
| Functions | 4 |
| Longest Function | 24 lines |
| Avg LOC/Function | 7.50 |
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
| McCabe (Cyclomatic) | 6 | 2.75 | 0 |
| Cognitive (SonarJS) | 6 | 4.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13107744 |
| Context Utilization | 68% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 96.96s |
| Avg Red Phase | 27.86s |
| Avg Green Phase | 19.49s |
| Avg Refactor Phase | 49.61s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 18 |
| Predictions Total | 18 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


