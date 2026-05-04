# Analysis Report: 2026-05-04_06-44-06_game-of-life-example-mapping_v3-basic-tdd_haiku-4-5

Generated: 2026-05-04T06:44:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v3-basic-tdd |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 41s |
| Started | 2026-05-04T06:44:06+00:00 |
| Ended | 2026-05-04T06:44:49+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 91
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 169
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-04_06-44-06_game-of-life-example-mapping_v3-basic-tdd_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-04_06-44-06_game-of-life-example-mapping_v3-basic-tdd_haiku-4-5

 ✓ src/game-of-life.spec.ts  (15 tests) 5ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  06:44:50
   Duration  161ms (transform 28ms, setup 0ms, collect 28ms, tests 5ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 23 | ×1 | 23 |
| Invocations | 31 | ×2 | 62 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 7 | ×5 | 35 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **222** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 67 |
| Functions | 5 |
| Longest Function | 40 lines |
| Avg LOC/Function | 12 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 640160 |
| Context Utilization | 18% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 1.37s |
| Avg Red Phase | 0s |
| Avg Green Phase | 1.37s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


