# Analysis Report: 2026-09-05_09-12-26_game-of-life-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-2

Generated: 2026-09-05T09:28:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1.5-pure-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 958s |
| Started | 2026-09-05T09:12:26+00:00 |
| Ended | 2026-09-05T09:28:26+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 53
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 53
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_09-12-26_game-of-life-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_09-12-26_game-of-life-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-2

 ✓ src/game-of-life.spec.ts  (10 tests) 5ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  09:28:27
   Duration  234ms (transform 44ms, setup 0ms, collect 40ms, tests 5ms, environment 0ms, prepare 61ms)
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
| Invocations | 28 | ×2 | 56 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 3 | ×5 | 15 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **155** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 42 |
| Functions | 8 |
| Longest Function | 7 lines |
| Avg LOC/Function | 4.00 |
| Median LOC/Function | 3.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 2 | 1.15 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14888496 |
| Context Utilization | 71% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 93.43s |
| Avg Red Phase | 24.68s |
| Avg Green Phase | 18.15s |
| Avg Refactor Phase | 50.6s |

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


