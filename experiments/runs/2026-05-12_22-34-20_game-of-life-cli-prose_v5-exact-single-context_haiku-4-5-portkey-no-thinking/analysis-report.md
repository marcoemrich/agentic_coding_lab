# Analysis Report: 2026-05-12_22-34-20_game-of-life-cli-prose_v5-exact-single-context_haiku-4-5-portkey-no-thinking

Generated: 2026-05-13T10:59:04+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-prose |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5-portkey-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 322s |
| Started | 2026-05-12T22:34:20+00:00 |
| Ended | 2026-05-12T22:39:43+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, gameOfLife.ts
- **Implementation LOC** (total): 103
- **Test file**: gameOfLife.spec.ts
- **Test file LOC**: 59
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_22-34-20_game-of-life-cli-prose_v5-exact-single-context_haiku-4-5-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_22-34-20_game-of-life-cli-prose_v5-exact-single-context_haiku-4-5-portkey-no-thinking

 ✓ src/gameOfLife.spec.ts  (10 tests) 3ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  10:59:04
   Duration  364ms (transform 26ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 74ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 74% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 30 | ×1 | 30 |
| Invocations | 41 | ×2 | 82 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 9 | ×5 | 45 |
| Assignments | 18 | ×6 | 108 |
| **Total Mass** | | | **281** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 81 |
| Functions | 6 |
| Longest Function | 13 lines |
| Avg LOC/Function | 4.17 |
| Median LOC/Function | 2.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 1 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 2.75 | 0 |
| Cognitive (SonarJS) | 11 | 3.40 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9961373 |
| Context Utilization | 50% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 55.91s |
| Avg Red Phase | 11.48s |
| Avg Green Phase | 13.52s |
| Avg Refactor Phase | 30.91s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 22 |
| Predictions Total | 22 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


