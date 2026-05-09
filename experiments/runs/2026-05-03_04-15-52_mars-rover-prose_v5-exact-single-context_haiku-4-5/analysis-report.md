# Analysis Report: 2026-05-03_04-15-52_mars-rover-prose_v5-exact-single-context_haiku-4-5

Generated: 2026-05-09T11:01:27+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | mars-rover-prose |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 432s |
| Started | 2026-05-03T04:15:52+00:00 |
| Ended | 2026-05-03T04:23:04+00:00 |

## Code Metrics

- **Implementation file**: mars-rover.ts
- **Implementation LOC**: 49
- **Test file**: mars-rover.spec.ts
- **Test file LOC**: 45
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_04-15-52_mars-rover-prose_v5-exact-single-context_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_04-15-52_mars-rover-prose_v5-exact-single-context_haiku-4-5

 ✓ src/mars-rover.spec.ts  (10 tests) 2ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  11:01:28
   Duration  336ms (transform 29ms, setup 0ms, collect 22ms, tests 2ms, environment 0ms, prepare 88ms)
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
| Invocations | 5 | ×2 | 10 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 1 | ×5 | 5 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **118** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 43 |
| Functions | 1 |
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

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 5.00 | 0 |
| Cognitive (SonarJS) | 7 | 7.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12154332 |
| Context Utilization | 46% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 72.54s |
| Avg Red Phase | 19.77s |
| Avg Green Phase | 17.91s |
| Avg Refactor Phase | 34.86s |

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
| Tests Passed Immediately | 6 |


