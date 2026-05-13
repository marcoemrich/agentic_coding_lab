# Analysis Report: 2026-05-13_06-08-05_game-of-life-cli-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-13T11:37:15+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 896s |
| Started | 2026-05-13T06:08:05+00:00 |
| Ended | 2026-05-13T06:23:02+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, game-of-life.ts
- **Implementation LOC** (total): 61
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 45
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_06-08-05_game-of-life-cli-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_06-08-05_game-of-life-cli-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 3ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  11:37:16
   Duration  364ms (transform 27ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 104ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 27 | ×1 | 27 |
| Invocations | 37 | ×2 | 74 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 8 | ×5 | 40 |
| Assignments | 21 | ×6 | 126 |
| **Total Mass** | | | **287** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 53 |
| Functions | 4 |
| Longest Function | 28 lines |
| Avg LOC/Function | 12.00 |
| Median LOC/Function | 8.50 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 9 | 2.78 | 0 |
| Cognitive (SonarJS) | 18 | 6.20 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17273059 |
| Context Utilization | 67% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 127.69s |
| Avg Red Phase | 41.29s |
| Avg Green Phase | 31.36s |
| Avg Refactor Phase | 55.04s |

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
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


