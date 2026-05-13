# Analysis Report: 2026-05-12_22-43-03_game-of-life-cli-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-13T11:31:36+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 580s |
| Started | 2026-05-12T22:43:03+00:00 |
| Ended | 2026-05-12T22:52:44+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, game-of-life.ts
- **Implementation LOC** (total): 42
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 52
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_22-43-03_game-of-life-cli-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_22-43-03_game-of-life-cli-prose_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/game-of-life.spec.ts  (8 tests) 3ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  11:31:36
   Duration  374ms (transform 27ms, setup 0ms, collect 21ms, tests 3ms, environment 0ms, prepare 60ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 73% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 23 | ×1 | 23 |
| Invocations | 26 | ×2 | 52 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 6 | ×5 | 30 |
| Assignments | 20 | ×6 | 120 |
| **Total Mass** | | | **229** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 36 |
| Functions | 3 |
| Longest Function | 19 lines |
| Avg LOC/Function | 9.33 |
| Median LOC/Function | 7.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 7 | 2.11 | 0 |
| Cognitive (SonarJS) | 12 | 4.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11528679 |
| Context Utilization | 53% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 101.95s |
| Avg Red Phase | 28.36s |
| Avg Green Phase | 21.14s |
| Avg Refactor Phase | 52.45s |

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
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


