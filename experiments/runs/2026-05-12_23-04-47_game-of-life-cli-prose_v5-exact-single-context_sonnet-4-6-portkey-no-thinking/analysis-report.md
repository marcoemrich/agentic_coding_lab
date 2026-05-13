# Analysis Report: 2026-05-12_23-04-47_game-of-life-cli-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-05-13T11:32:26+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-prose |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 466s |
| Started | 2026-05-12T23:04:47+00:00 |
| Ended | 2026-05-12T23:12:35+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, game-of-life.ts
- **Implementation LOC** (total): 50
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 23
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (6 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_23-04-47_game-of-life-cli-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_23-04-47_game-of-life-cli-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/game-of-life.spec.ts  (6 tests) 2ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  11:32:26
   Duration  368ms (transform 40ms, setup 0ms, collect 25ms, tests 2ms, environment 0ms, prepare 143ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 64% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 20 | ×1 | 20 |
| Invocations | 24 | ×2 | 48 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 5 | ×5 | 25 |
| Assignments | 20 | ×6 | 120 |
| **Total Mass** | | | **225** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 39 |
| Functions | 3 |
| Longest Function | 22 lines |
| Avg LOC/Function | 8.67 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.14 | 0 |
| Cognitive (SonarJS) | 8 | 4.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7921714 |
| Context Utilization | 10% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 73.01s |
| Avg Red Phase | 24.24s |
| Avg Green Phase | 10.39s |
| Avg Refactor Phase | 38.38s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 9 |
| Predictions Total | 12 |
| Accuracy | 75% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


