# Analysis Report: 2026-05-13_00-29-59_game-of-life-cli-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking

Generated: 2026-05-13T11:03:06+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-example-mapping |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5-portkey-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 710s |
| Started | 2026-05-13T00:29:59+00:00 |
| Ended | 2026-05-13T00:41:50+00:00 |

## Code Metrics

- **Implementation files**: gameOfLife.ts
- **Implementation LOC** (total): 71
- **Test file**: gameOfLife.spec.ts
- **Test file LOC**: 44
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (6 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_00-29-59_game-of-life-cli-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_00-29-59_game-of-life-cli-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking

 ✓ src/gameOfLife.spec.ts  (6 tests) 3ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  11:03:07
   Duration  381ms (transform 25ms, setup 0ms, collect 20ms, tests 3ms, environment 0ms, prepare 65ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 23 | ×1 | 23 |
| Invocations | 34 | ×2 | 68 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 10 | ×5 | 50 |
| Assignments | 19 | ×6 | 114 |
| **Total Mass** | | | **283** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 55 |
| Functions | 5 |
| Longest Function | 10 lines |
| Avg LOC/Function | 4.20 |
| Median LOC/Function | 2.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 2.75 | 0 |
| Cognitive (SonarJS) | 14 | 7.33 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11733975 |
| Context Utilization | 56% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 70.26s |
| Avg Red Phase | 15.81s |
| Avg Green Phase | 27.13s |
| Avg Refactor Phase | 27.32s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 13 |
| Predictions Total | 13 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


