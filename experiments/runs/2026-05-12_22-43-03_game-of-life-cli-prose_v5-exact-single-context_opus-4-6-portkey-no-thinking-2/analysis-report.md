# Analysis Report: 2026-05-12_22-43-03_game-of-life-cli-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking-2

Generated: 2026-05-13T11:31:46+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 769s |
| Started | 2026-05-12T22:43:03+00:00 |
| Ended | 2026-05-12T22:55:53+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, game-of-life.ts
- **Implementation LOC** (total): 79
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 45
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_22-43-03_game-of-life-cli-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_22-43-03_game-of-life-cli-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking-2

 ✓ src/game-of-life.spec.ts  (8 tests) 4ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  11:31:46
   Duration  375ms (transform 26ms, setup 0ms, collect 22ms, tests 4ms, environment 0ms, prepare 88ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 73% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 24 | ×1 | 24 |
| Invocations | 42 | ×2 | 84 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 8 | ×5 | 40 |
| Assignments | 33 | ×6 | 198 |
| **Total Mass** | | | **358** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 65 |
| Functions | 9 |
| Longest Function | 25 lines |
| Avg LOC/Function | 7.56 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 6 | 1.81 | 0 |
| Cognitive (SonarJS) | 9 | 3.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16746952 |
| Context Utilization | 64% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 97.36s |
| Avg Red Phase | 28.16s |
| Avg Green Phase | 23.27s |
| Avg Refactor Phase | 45.93s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


