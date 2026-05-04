# Analysis Report: 2026-05-04_06-42-02_game-of-life-example-mapping_v3-basic-tdd_haiku-4-5

Generated: 2026-05-04T06:42:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v3-basic-tdd |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 55s |
| Started | 2026-05-04T06:42:02+00:00 |
| Ended | 2026-05-04T06:42:58+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 56
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 153
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-04_06-42-02_game-of-life-example-mapping_v3-basic-tdd_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-04_06-42-02_game-of-life-example-mapping_v3-basic-tdd_haiku-4-5

 ✓ src/game-of-life.spec.ts  (16 tests) 5ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  06:42:58
   Duration  165ms (transform 34ms, setup 0ms, collect 31ms, tests 5ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 26 | ×1 | 26 |
| Invocations | 23 | ×2 | 46 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 6 | ×5 | 30 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **184** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 42 |
| Functions | 2 |
| Longest Function | 37 lines |
| Avg LOC/Function | 23 |
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
| Total Tokens | 1019095 |
| Context Utilization | 22% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 2.15s |
| Avg Red Phase | 0.68s |
| Avg Green Phase | 1.47s |
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
| Tests Passed Immediately | 1 |


