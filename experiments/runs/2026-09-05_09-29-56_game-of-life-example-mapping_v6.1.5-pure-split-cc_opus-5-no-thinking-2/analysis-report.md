# Analysis Report: 2026-09-05_09-29-56_game-of-life-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-2

Generated: 2026-09-05T09:40:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1.5-pure-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 623s |
| Started | 2026-09-05T09:29:56+00:00 |
| Ended | 2026-09-05T09:40:23+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 49
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 114
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_09-29-56_game-of-life-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_09-29-56_game-of-life-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-2

 ✓ src/game-of-life.spec.ts  (10 tests) 5ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  09:40:24
   Duration  303ms (transform 46ms, setup 0ms, collect 43ms, tests 5ms, environment 0ms, prepare 90ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 5 | ×1 | 5 |
| Invocations | 31 | ×2 | 62 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 4 | ×5 | 20 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **163** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 41 |
| Functions | 6 |
| Longest Function | 11 lines |
| Avg LOC/Function | 6.33 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 3 | 1.36 | 0 |
| Cognitive (SonarJS) | 3 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9138845 |
| Context Utilization | 55% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 103.27s |
| Avg Red Phase | 23.14s |
| Avg Green Phase | 17.29s |
| Avg Refactor Phase | 62.84s |

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
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


