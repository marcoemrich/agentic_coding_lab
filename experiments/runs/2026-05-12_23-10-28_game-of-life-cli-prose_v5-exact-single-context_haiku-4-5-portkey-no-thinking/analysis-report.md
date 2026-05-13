# Analysis Report: 2026-05-12_23-10-28_game-of-life-cli-prose_v5-exact-single-context_haiku-4-5-portkey-no-thinking

Generated: 2026-05-13T11:00:14+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-prose |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5-portkey-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 374s |
| Started | 2026-05-12T23:10:28+00:00 |
| Ended | 2026-05-12T23:16:43+00:00 |

## Code Metrics

- **Implementation files**: gameOfLife.ts
- **Implementation LOC** (total): 44
- **Test file**: cli.spec.ts
- **Test file LOC**: 66
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_23-10-28_game-of-life-cli-prose_v5-exact-single-context_haiku-4-5-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_23-10-28_game-of-life-cli-prose_v5-exact-single-context_haiku-4-5-portkey-no-thinking

 ✓ src/cli.spec.ts  (9 tests) 2ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  11:00:14
   Duration  355ms (transform 24ms, setup 0ms, collect 19ms, tests 2ms, environment 0ms, prepare 82ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 33 | ×1 | 33 |
| Invocations | 17 | ×2 | 34 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 2 | ×5 | 10 |
| Assignments | 8 | ×6 | 48 |
| **Total Mass** | | | **129** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 37 |
| Functions | 6 |
| Longest Function | 8 lines |
| Avg LOC/Function | 4.67 |
| Median LOC/Function | 3.50 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 3 | 1.67 | 0 |
| Cognitive (SonarJS) | 3 | 1.40 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14659709 |
| Context Utilization | 61% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 49.01s |
| Avg Red Phase | 17.11s |
| Avg Green Phase | 11.05s |
| Avg Refactor Phase | 20.85s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


