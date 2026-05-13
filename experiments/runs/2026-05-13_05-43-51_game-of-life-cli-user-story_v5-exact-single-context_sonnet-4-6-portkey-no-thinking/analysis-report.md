# Analysis Report: 2026-05-13_05-43-51_game-of-life-cli-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-05-13T11:04:00+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-user-story |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 495s |
| Started | 2026-05-13T05:43:51+00:00 |
| Ended | 2026-05-13T05:52:08+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, gameOfLife.ts
- **Implementation LOC** (total): 43
- **Test file**: gameOfLife.spec.ts
- **Test file LOC**: 23
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (6 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_05-43-51_game-of-life-cli-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_05-43-51_game-of-life-cli-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/gameOfLife.spec.ts  (6 tests) 2ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  11:04:01
   Duration  349ms (transform 26ms, setup 0ms, collect 18ms, tests 2ms, environment 0ms, prepare 84ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 72% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 18 | ×1 | 18 |
| Invocations | 27 | ×2 | 54 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 6 | ×5 | 30 |
| Assignments | 18 | ×6 | 108 |
| **Total Mass** | | | **226** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 35 |
| Functions | 3 |
| Longest Function | 26 lines |
| Avg LOC/Function | 9.67 |
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
| McCabe (Cyclomatic) | 12 | 2.50 | 1 |
| Cognitive (SonarJS) | 18 | 9.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9293089 |
| Context Utilization | 10% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 77.46s |
| Avg Red Phase | 24.27s |
| Avg Green Phase | 13.68s |
| Avg Refactor Phase | 39.51s |

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


