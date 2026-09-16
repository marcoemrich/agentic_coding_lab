# Analysis Report: 2026-09-16_06-53-32_game-of-life-prose_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking

Generated: 2026-09-16T07:00:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-prose |
| Workflow | exact-sol-v1.6-test-list-dimensions-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 406s |
| Started | 2026-09-16T06:53:32+00:00 |
| Ended | 2026-09-16T07:00:21+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 61
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 125
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (18 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_06-53-32_game-of-life-prose_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_06-53-32_game-of-life-prose_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (18 tests) 7ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  07:00:22
   Duration  258ms (transform 52ms, setup 0ms, collect 53ms, tests 7ms, environment 0ms, prepare 69ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 8 | ×1 | 8 |
| Invocations | 39 | ×2 | 78 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 5 | ×5 | 25 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **211** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 52 |
| Functions | 8 |
| Longest Function | 11 lines |
| Avg LOC/Function | 6.00 |
| Median LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 4 | 1.33 | 0 |
| Cognitive (SonarJS) | 6 | 2.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4249435 |
| Context Utilization | 40% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 18 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 37 |
| Predictions Total | 37 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


