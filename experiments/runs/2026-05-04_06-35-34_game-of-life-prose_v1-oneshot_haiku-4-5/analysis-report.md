# Analysis Report: 2026-05-04_06-35-34_game-of-life-prose_v1-oneshot_haiku-4-5

Generated: 2026-05-04T06:36:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-prose |
| Workflow | v1-oneshot |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 74s |
| Started | 2026-05-04T06:35:34+00:00 |
| Ended | 2026-05-04T06:36:49+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 76
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 144
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (17 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-04_06-35-34_game-of-life-prose_v1-oneshot_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-04_06-35-34_game-of-life-prose_v1-oneshot_haiku-4-5

 ✓ src/game-of-life.spec.ts  (17 tests) 5ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  06:36:50
   Duration  154ms (transform 27ms, setup 0ms, collect 26ms, tests 5ms, environment 0ms, prepare 41ms)
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
| Invocations | 34 | ×2 | 68 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 8 | ×5 | 40 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **242** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 56 |
| Functions | 5 |
| Longest Function | 35 lines |
| Avg LOC/Function | 14 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **4** |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1164263 |
| Context Utilization | 21% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 10.23s |
| Avg Red Phase | 10.23s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | N/A |
| Predictions Total | N/A |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


