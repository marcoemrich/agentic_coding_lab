# Analysis Report: 2026-05-10_16-06-17_game-of-life-example-mapping_v5-exact-single-context_haiku-4-5-no-thinking

Generated: 2026-05-10T19:13:30+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 493s |
| Started | 2026-05-10T16:06:17+00:00 |
| Ended | 2026-05-10T16:14:33+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 59
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 62
- **Active tests**: 6
- **Remaining todos**: 3

## Test Results

**Status**: ✅ All tests passing (6 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_16-06-17_game-of-life-example-mapping_v5-exact-single-context_haiku-4-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_16-06-17_game-of-life-example-mapping_v5-exact-single-context_haiku-4-5-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests | 3 skipped) 4ms

 Test Files  1 passed (1)
      Tests  6 passed | 3 todo (9)
   Start at  19:13:30
   Duration  452ms (transform 38ms, setup 0ms, collect 32ms, tests 4ms, environment 0ms, prepare 148ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 16 | ×1 | 16 |
| Invocations | 31 | ×2 | 62 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 10 | ×5 | 50 |
| Assignments | 18 | ×6 | 108 |
| **Total Mass** | | | **260** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 49 |
| Functions | 5 |
| Longest Function | 10 lines |
| Avg LOC/Function | 4.60 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 9 | 3.33 | 0 |
| Cognitive (SonarJS) | 13 | 7.67 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17818354 |
| Context Utilization | 64% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 95.13s |
| Avg Red Phase | 29.24s |
| Avg Green Phase | 39.68s |
| Avg Refactor Phase | 26.21s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 10 |
| Predictions Total | 10 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


