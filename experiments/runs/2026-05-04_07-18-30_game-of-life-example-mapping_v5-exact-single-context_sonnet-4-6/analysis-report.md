# Analysis Report: 2026-05-04_07-18-30_game-of-life-example-mapping_v5-exact-single-context_sonnet-4-6

Generated: 2026-05-04T07:32:24+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6 |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 833s |
| Started | 2026-05-04T07:18:30+00:00 |
| Ended | 2026-05-04T07:32:24+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 34
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 40
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-04_07-18-30_game-of-life-example-mapping_v5-exact-single-context_sonnet-4-6
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-04_07-18-30_game-of-life-example-mapping_v5-exact-single-context_sonnet-4-6

 ✓ src/game-of-life.spec.ts  (9 tests) 4ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  07:32:25
   Duration  160ms (transform 26ms, setup 0ms, collect 25ms, tests 4ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 12 | ×1 | 12 |
| Invocations | 21 | ×2 | 42 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 5 | ×5 | 25 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **183** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 28 |
| Functions | 4 |
| Longest Function | 14 lines |
| Avg LOC/Function | 7 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **6** |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13133695 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 91.71s |
| Avg Red Phase | 38.48s |
| Avg Green Phase | 20.23s |
| Avg Refactor Phase | 33s |

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
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


