# Analysis Report: 2026-05-04_06-44-57_game-of-life-example-mapping_v5-exact-single-context_sonnet-4-6

Generated: 2026-05-04T06:59:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6 |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 846s |
| Started | 2026-05-04T06:44:57+00:00 |
| Ended | 2026-05-04T06:59:05+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 41
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 40
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-04_06-44-57_game-of-life-example-mapping_v5-exact-single-context_sonnet-4-6
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-04_06-44-57_game-of-life-example-mapping_v5-exact-single-context_sonnet-4-6

 ✓ src/game-of-life.spec.ts  (9 tests) 4ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  06:59:06
   Duration  159ms (transform 26ms, setup 0ms, collect 24ms, tests 4ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 9 | ×1 | 9 |
| Invocations | 25 | ×2 | 50 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 6 | ×5 | 30 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **191** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 33 |
| Functions | 4 |
| Longest Function | 23 lines |
| Avg LOC/Function | 9 |
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
| Total Tokens | 14604080 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 107.40s |
| Avg Red Phase | 34.07s |
| Avg Green Phase | 28.84s |
| Avg Refactor Phase | 44.49s |

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
| Tests Passed Immediately | 5 |


