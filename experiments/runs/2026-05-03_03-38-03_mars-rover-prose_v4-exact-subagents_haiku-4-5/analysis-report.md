# Analysis Report: 2026-05-03_03-38-03_mars-rover-prose_v4-exact-subagents_haiku-4-5

Generated: 2026-05-09T11:01:03+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | mars-rover-prose |
| Workflow | v4-exact-subagents |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 593s |
| Started | 2026-05-03T03:38:03+00:00 |
| Ended | 2026-05-03T03:47:56+00:00 |

## Code Metrics

- **Implementation file**: mars-rover.ts
- **Implementation LOC**: 63
- **Test file**: mars-rover.spec.ts
- **Test file LOC**: 58
- **Active tests**: 8
- **Remaining todos**: 10

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_03-38-03_mars-rover-prose_v4-exact-subagents_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_03-38-03_mars-rover-prose_v4-exact-subagents_haiku-4-5

 ✓ src/mars-rover.spec.ts  (18 tests | 10 skipped) 3ms

 Test Files  1 passed (1)
      Tests  8 passed | 10 todo (18)
   Start at  11:01:04
   Duration  352ms (transform 27ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 63ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 16 | ×1 | 16 |
| Invocations | 13 | ×2 | 26 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 0 | ×5 | 0 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **148** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 55 |
| Functions | 0 |
| Longest Function | 0 lines |
| Avg LOC/Function | 0 |
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
| McCabe (Cyclomatic) | 2 | 1.33 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2246476 |
| Context Utilization | 24% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 64.77s |
| Avg Red Phase | 20.43s |
| Avg Green Phase | 15.23s |
| Avg Refactor Phase | 29.11s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 6 |
| Predictions Total | 6 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


