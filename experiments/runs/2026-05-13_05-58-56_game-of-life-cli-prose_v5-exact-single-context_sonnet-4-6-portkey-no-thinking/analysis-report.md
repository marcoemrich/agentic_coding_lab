# Analysis Report: 2026-05-13_05-58-56_game-of-life-cli-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-05-13T11:36:55+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-prose |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 531s |
| Started | 2026-05-13T05:58:56+00:00 |
| Ended | 2026-05-13T06:07:49+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, game-of-life.ts
- **Implementation LOC** (total): 46
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 25
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (6 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_05-58-56_game-of-life-cli-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_05-58-56_game-of-life-cli-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/game-of-life.spec.ts  (6 tests) 3ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  11:36:55
   Duration  342ms (transform 23ms, setup 0ms, collect 19ms, tests 3ms, environment 0ms, prepare 58ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 63% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 18 | ×1 | 18 |
| Invocations | 27 | ×2 | 54 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 7 | ×5 | 35 |
| Assignments | 20 | ×6 | 120 |
| **Total Mass** | | | **239** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 37 |
| Functions | 3 |
| Longest Function | 24 lines |
| Avg LOC/Function | 9.00 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 2.38 | 1 |
| Cognitive (SonarJS) | 17 | 9.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9021823 |
| Context Utilization | 10% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 83.94s |
| Avg Red Phase | 27.01s |
| Avg Green Phase | 14.2s |
| Avg Refactor Phase | 42.73s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 11 |
| Predictions Total | 12 |
| Accuracy | 91% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


