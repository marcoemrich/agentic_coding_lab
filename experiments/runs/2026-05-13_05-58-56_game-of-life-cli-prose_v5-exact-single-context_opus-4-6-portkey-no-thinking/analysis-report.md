# Analysis Report: 2026-05-13_05-58-56_game-of-life-cli-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-13T11:36:35+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 477s |
| Started | 2026-05-13T05:58:56+00:00 |
| Ended | 2026-05-13T06:06:55+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, game-of-life.ts
- **Implementation LOC** (total): 47
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 63
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_05-58-56_game-of-life-cli-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_05-58-56_game-of-life-cli-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 3ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  11:36:35
   Duration  387ms (transform 28ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 101ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 78% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 22 | ×1 | 22 |
| Invocations | 29 | ×2 | 58 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 7 | ×5 | 35 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **219** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 41 |
| Functions | 3 |
| Longest Function | 25 lines |
| Avg LOC/Function | 11.67 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 11 | 2.71 | 1 |
| Cognitive (SonarJS) | 17 | 6.33 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7856703 |
| Context Utilization | 45% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 150.76s |
| Avg Red Phase | 77.49s |
| Avg Green Phase | 23.96s |
| Avg Refactor Phase | 49.31s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 4 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


