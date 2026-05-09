# Analysis Report: 2026-05-03_03-54-34_mars-rover-prose_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-05-09T11:01:15+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | mars-rover-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 335s |
| Started | 2026-05-03T03:54:34+00:00 |
| Ended | 2026-05-03T04:00:10+00:00 |

## Code Metrics

- **Implementation file**: mars-rover.ts
- **Implementation LOC**: 41
- **Test file**: mars-rover.spec.ts
- **Test file LOC**: 29
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_03-54-34_mars-rover-prose_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_03-54-34_mars-rover-prose_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/mars-rover.spec.ts  (8 tests) 2ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  11:01:16
   Duration  345ms (transform 25ms, setup 0ms, collect 21ms, tests 2ms, environment 0ms, prepare 66ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 23 | ×1 | 23 |
| Invocations | 5 | ×2 | 10 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 1 | ×5 | 5 |
| Assignments | 7 | ×6 | 42 |
| **Total Mass** | | | **92** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 35 |
| Functions | 2 |
| Longest Function | 9 lines |
| Avg LOC/Function | 5 |
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
| McCabe (Cyclomatic) | 4 | 2.50 | 0 |
| Cognitive (SonarJS) | 3 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9018049 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 38.47s |
| Avg Red Phase | 14.33s |
| Avg Green Phase | 12.84s |
| Avg Refactor Phase | 11.3s |

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


