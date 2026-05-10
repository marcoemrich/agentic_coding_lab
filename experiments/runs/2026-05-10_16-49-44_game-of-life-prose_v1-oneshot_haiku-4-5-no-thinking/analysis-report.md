# Analysis Report: 2026-05-10_16-49-44_game-of-life-prose_v1-oneshot_haiku-4-5-no-thinking

Generated: 2026-05-10T19:13:03+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-prose |
| Workflow | v1-oneshot |
| Model | haiku-4-5-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 27s |
| Started | 2026-05-10T16:49:44+00:00 |
| Ended | 2026-05-10T16:50:14+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 71
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 102
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_16-49-44_game-of-life-prose_v1-oneshot_haiku-4-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_16-49-44_game-of-life-prose_v1-oneshot_haiku-4-5-no-thinking

 ✓ src/game-of-life.spec.ts  (12 tests) 4ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  19:13:04
   Duration  350ms (transform 25ms, setup 0ms, collect 19ms, tests 4ms, environment 0ms, prepare 72ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 27 | ×1 | 27 |
| Invocations | 35 | ×2 | 70 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 11 | ×5 | 55 |
| Assignments | 20 | ×6 | 120 |
| **Total Mass** | | | **296** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 54 |
| Functions | 3 |
| Longest Function | 49 lines |
| Avg LOC/Function | 23.00 |
| Median LOC/Function | 16.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 1 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **8** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 17 | 6.25 | 1 |
| Cognitive (SonarJS) | 29 | 19.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 344698 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | N/A |
| Predictions Total | N/A |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


