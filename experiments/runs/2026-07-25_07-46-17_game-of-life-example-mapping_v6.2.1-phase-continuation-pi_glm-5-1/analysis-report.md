# Analysis Report: 2026-07-25_07-46-17_game-of-life-example-mapping_v6.2.1-phase-continuation-pi_glm-5-1

Generated: 2026-07-25T14:34:43+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | glm-5-1 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1513s |
| Started | 2026-07-25T07:46:17+00:00 |
| Ended | 2026-07-25T08:11:31+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 57
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 126
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_07-46-17_game-of-life-example-mapping_v6.2.1-phase-continuation-pi_glm-5-1
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_07-46-17_game-of-life-example-mapping_v6.2.1-phase-continuation-pi_glm-5-1

 ✓ src/game-of-life.spec.ts  (11 tests) 4ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  14:34:43
   Duration  298ms (transform 28ms, setup 0ms, collect 21ms, tests 4ms, environment 0ms, prepare 145ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 31 | ×1 | 31 |
| Invocations | 28 | ×2 | 56 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 6 | ×5 | 30 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **195** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 46 |
| Functions | 5 |
| Longest Function | 26 lines |
| Avg LOC/Function | 9.00 |
| Median LOC/Function | 4.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.67 | 0 |
| Cognitive (SonarJS) | 7 | 3.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1200515 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 22 |
| Predictions Total | 22 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


