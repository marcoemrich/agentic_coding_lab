# Analysis Report: 2026-05-12_23-26-53_game-of-life-cli-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-05-13T11:33:26+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-user-story |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 820s |
| Started | 2026-05-12T23:26:53+00:00 |
| Ended | 2026-05-12T23:40:34+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, game-of-life.ts
- **Implementation LOC** (total): 45
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 43
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_23-26-53_game-of-life-cli-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_23-26-53_game-of-life-cli-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 3ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  11:33:27
   Duration  377ms (transform 26ms, setup 0ms, collect 23ms, tests 3ms, environment 0ms, prepare 79ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 66% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 20 | ×1 | 20 |
| Invocations | 26 | ×2 | 52 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 6 | ×5 | 30 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **218** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 38 |
| Functions | 2 |
| Longest Function | 26 lines |
| Avg LOC/Function | 14.00 |
| Median LOC/Function | 14.00 |
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
| McCabe (Cyclomatic) | 13 | 3.17 | 1 |
| Cognitive (SonarJS) | 19 | 10.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14697643 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 98.73s |
| Avg Red Phase | 27.94s |
| Avg Green Phase | 25.9s |
| Avg Refactor Phase | 44.89s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 18 |
| Predictions Total | 18 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


