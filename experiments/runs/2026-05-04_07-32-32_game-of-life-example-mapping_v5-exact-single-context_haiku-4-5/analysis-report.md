# Analysis Report: 2026-05-04_07-32-32_game-of-life-example-mapping_v5-exact-single-context_haiku-4-5

Generated: 2026-05-04T07:38:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 368s |
| Started | 2026-05-04T07:32:32+00:00 |
| Ended | 2026-05-04T07:38:42+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 50
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 28
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (6 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-04_07-32-32_game-of-life-example-mapping_v5-exact-single-context_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-04_07-32-32_game-of-life-example-mapping_v5-exact-single-context_haiku-4-5

 ✓ src/game-of-life.spec.ts  (6 tests) 3ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  07:38:43
   Duration  147ms (transform 22ms, setup 0ms, collect 21ms, tests 3ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 11 | ×2 | 22 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 0 | ×5 | 0 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **166** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 39 |
| Functions | 5 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 0 |
| **Total** | **13** |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9344561 |
| Context Utilization | 42% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 79.72s |
| Avg Red Phase | 24.6s |
| Avg Green Phase | 14.85s |
| Avg Refactor Phase | 40.27s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 5 |
| Predictions Total | 5 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


