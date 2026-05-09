# Analysis Report: 2026-05-04_06-43-06_game-of-life-example-mapping_v3-basic-tdd_haiku-4-5

Generated: 2026-05-09T11:08:51+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v3-basic-tdd |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 51s |
| Started | 2026-05-04T06:43:06+00:00 |
| Ended | 2026-05-04T06:43:58+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 70
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 170
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-04_06-43-06_game-of-life-example-mapping_v3-basic-tdd_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-04_06-43-06_game-of-life-example-mapping_v3-basic-tdd_haiku-4-5

 ✓ src/game-of-life.spec.ts  (12 tests) 5ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  11:08:51
   Duration  374ms (transform 30ms, setup 0ms, collect 24ms, tests 5ms, environment 0ms, prepare 83ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 35 | ×1 | 35 |
| Invocations | 30 | ×2 | 60 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 10 | ×5 | 50 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **255** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 49 |
| Functions | 2 |
| Longest Function | 57 lines |
| Avg LOC/Function | 34 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 12 | 5.25 | 1 |
| Cognitive (SonarJS) | 23 | 11.33 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1111149 |
| Context Utilization | 21% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 2.26s |
| Avg Red Phase | 0.73s |
| Avg Green Phase | 1.53s |
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


