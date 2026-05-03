# Analysis Report: 2026-05-03_17-04-35_game-of-life-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-05-03T17:10:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 377s |
| Started | 2026-05-03T17:04:35+00:00 |
| Ended | 2026-05-03T17:10:53+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 37
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 42
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-03_17-04-35_game-of-life-example-mapping_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-03_17-04-35_game-of-life-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (8 tests) 3ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  17:10:54
   Duration  145ms (transform 22ms, setup 0ms, collect 21ms, tests 3ms, environment 0ms, prepare 40ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 18 | ×1 | 18 |
| Invocations | 21 | ×2 | 42 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 5 | ×5 | 25 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **155** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 31 |
| Functions | 4 |
| Longest Function | 21 lines |
| Avg LOC/Function | 6 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10773096 |
| Context Utilization | 60% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 44.23s |
| Avg Red Phase | 19.11s |
| Avg Green Phase | 10.28s |
| Avg Refactor Phase | 14.84s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


