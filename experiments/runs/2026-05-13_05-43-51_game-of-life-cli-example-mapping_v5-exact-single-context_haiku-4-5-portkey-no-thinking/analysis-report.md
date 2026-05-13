# Analysis Report: 2026-05-13_05-43-51_game-of-life-cli-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking

Generated: 2026-05-13T11:36:01+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-example-mapping |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5-portkey-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 443s |
| Started | 2026-05-13T05:43:51+00:00 |
| Ended | 2026-05-13T05:51:16+00:00 |

## Code Metrics

- **Implementation files**: gameOfLife.ts
- **Implementation LOC** (total): 50
- **Test file**: gameOfLife.spec.ts
- **Test file LOC**: 68
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_05-43-51_game-of-life-cli-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_05-43-51_game-of-life-cli-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking

 ✓ src/gameOfLife.spec.ts  (9 tests) 3ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  11:36:01
   Duration  382ms (transform 25ms, setup 0ms, collect 21ms, tests 3ms, environment 0ms, prepare 76ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 89 | ×1 | 89 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 5 | ×5 | 25 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **264** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 35 |
| Functions | 3 |
| Longest Function | 34 lines |
| Avg LOC/Function | 13.00 |
| Median LOC/Function | 3.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **12** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 3.00 | 0 |
| Cognitive (SonarJS) | 11 | 3.75 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16698499 |
| Context Utilization | 68% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 59.29s |
| Avg Red Phase | 16.18s |
| Avg Green Phase | 19.5s |
| Avg Refactor Phase | 23.61s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 8 |
| Predictions Total | 9 |
| Accuracy | 88% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


