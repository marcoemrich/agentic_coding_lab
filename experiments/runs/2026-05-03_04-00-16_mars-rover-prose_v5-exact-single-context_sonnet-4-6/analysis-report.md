# Analysis Report: 2026-05-03_04-00-16_mars-rover-prose_v5-exact-single-context_sonnet-4-6

Generated: 2026-05-03T11:08:53+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | mars-rover-prose |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6 |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 928s |
| Started | 2026-05-03T04:00:16+00:00 |
| Ended | 2026-05-03T04:15:45+00:00 |

## Code Metrics

- **Implementation file**: mars-rover.ts
- **Implementation LOC**: 21
- **Test file**: mars-rover.spec.ts
- **Test file LOC**: 29
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_04-00-16_mars-rover-prose_v5-exact-single-context_sonnet-4-6
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_04-00-16_mars-rover-prose_v5-exact-single-context_sonnet-4-6

 ✓ src/mars-rover.spec.ts  (8 tests) 2ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  11:08:54
   Duration  368ms (transform 28ms, setup 0ms, collect 22ms, tests 2ms, environment 0ms, prepare 69ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 7 | ×2 | 14 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 1 | ×5 | 5 |
| Assignments | 5 | ×6 | 30 |
| **Total Mass** | | | **79** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 20 |
| Functions | 2 |
| Longest Function | 2 lines |
| Avg LOC/Function | 2 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13570571 |
| Context Utilization | 64% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 112.04s |
| Avg Red Phase | 23.72s |
| Avg Green Phase | 25.52s |
| Avg Refactor Phase | 62.8s |

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
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


