# Analysis Report: 2026-05-04_06-38-06_game-of-life-prose_v1-oneshot_haiku-4-5

Generated: 2026-05-04T06:38:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-prose |
| Workflow | v1-oneshot |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 40s |
| Started | 2026-05-04T06:38:06+00:00 |
| Ended | 2026-05-04T06:38:47+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 63
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 85
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-04_06-38-06_game-of-life-prose_v1-oneshot_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-04_06-38-06_game-of-life-prose_v1-oneshot_haiku-4-5

 ✓ src/game-of-life.spec.ts  (11 tests) 4ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  06:38:47
   Duration  167ms (transform 25ms, setup 0ms, collect 22ms, tests 4ms, environment 0ms, prepare 51ms)
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
| Invocations | 26 | ×2 | 52 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 8 | ×5 | 40 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **232** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 46 |
| Functions | 4 |
| Longest Function | 12 lines |
| Avg LOC/Function | 5 |
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
| Total Tokens | 668996 |
| Context Utilization | 18% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
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


