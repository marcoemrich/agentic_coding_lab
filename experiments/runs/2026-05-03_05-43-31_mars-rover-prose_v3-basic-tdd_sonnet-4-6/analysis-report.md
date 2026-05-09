# Analysis Report: 2026-05-03_05-43-31_mars-rover-prose_v3-basic-tdd_sonnet-4-6

Generated: 2026-05-09T11:02:21+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | mars-rover-prose |
| Workflow | v3-basic-tdd |
| Model | sonnet-4-6 |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 40s |
| Started | 2026-05-03T05:43:31+00:00 |
| Ended | 2026-05-03T05:44:12+00:00 |

## Code Metrics

- **Implementation file**: mars-rover.ts
- **Implementation LOC**: 27
- **Test file**: mars-rover.spec.ts
- **Test file LOC**: 127
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (17 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_05-43-31_mars-rover-prose_v3-basic-tdd_sonnet-4-6
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_05-43-31_mars-rover-prose_v3-basic-tdd_sonnet-4-6

 ✓ src/mars-rover.spec.ts  (17 tests) 3ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  11:02:22
   Duration  353ms (transform 26ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 62ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 19 | ×1 | 19 |
| Invocations | 10 | ×2 | 20 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 1 | ×5 | 5 |
| Assignments | 9 | ×6 | 54 |
| **Total Mass** | | | **126** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 24 |
| Functions | 0 |
| Longest Function | 0 lines |
| Avg LOC/Function | 0 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 5.00 | 0 |
| Cognitive (SonarJS) | 11 | 11.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 334711 |
| Context Utilization | 3% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 5.58s |
| Avg Red Phase | 0s |
| Avg Green Phase | 5.58s |
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


