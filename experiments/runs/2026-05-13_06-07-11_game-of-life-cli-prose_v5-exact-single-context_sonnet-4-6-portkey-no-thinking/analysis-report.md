# Analysis Report: 2026-05-13_06-07-11_game-of-life-cli-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-05-13T11:37:05+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-prose |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 432s |
| Started | 2026-05-13T06:07:11+00:00 |
| Ended | 2026-05-13T06:14:24+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, game-of-life.ts
- **Implementation LOC** (total): 44
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 25
- **Active tests**: 5
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (5 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_06-07-11_game-of-life-cli-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_06-07-11_game-of-life-cli-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/game-of-life.spec.ts  (5 tests) 3ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  11:37:05
   Duration  376ms (transform 25ms, setup 0ms, collect 21ms, tests 3ms, environment 0ms, prepare 91ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 61% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 25 | ×1 | 25 |
| Invocations | 27 | ×2 | 54 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 6 | ×5 | 30 |
| Assignments | 20 | ×6 | 120 |
| **Total Mass** | | | **237** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 37 |
| Functions | 3 |
| Longest Function | 16 lines |
| Avg LOC/Function | 6.67 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 1.78 | 0 |
| Cognitive (SonarJS) | 9 | 5.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6494907 |
| Context Utilization | 9% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 80.02s |
| Avg Red Phase | 27.32s |
| Avg Green Phase | 16.33s |
| Avg Refactor Phase | 36.37s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 8 |
| Predictions Total | 10 |
| Accuracy | 80% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


