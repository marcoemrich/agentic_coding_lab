# Analysis Report: 2026-05-13_00-19-14_game-of-life-cli-example-mapping_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-05-13T11:34:59+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-example-mapping |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 462s |
| Started | 2026-05-13T00:19:14+00:00 |
| Ended | 2026-05-13T00:26:57+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, game-of-life.ts
- **Implementation LOC** (total): 43
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 22
- **Active tests**: 5
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (5 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_00-19-14_game-of-life-cli-example-mapping_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_00-19-14_game-of-life-cli-example-mapping_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/game-of-life.spec.ts  (5 tests) 2ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  11:35:00
   Duration  342ms (transform 28ms, setup 1ms, collect 18ms, tests 2ms, environment 0ms, prepare 63ms)
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
| Assignments | 17 | ×6 | 102 |
| **Total Mass** | | | **220** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 35 |
| Functions | 4 |
| Longest Function | 25 lines |
| Avg LOC/Function | 7.25 |
| Median LOC/Function | 1.50 |
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
| Total Tokens | 7639165 |
| Context Utilization | 9% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 94.53s |
| Avg Red Phase | 25.68s |
| Avg Green Phase | 22.93s |
| Avg Refactor Phase | 45.92s |

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
| Tests Passed Immediately | 2 |


