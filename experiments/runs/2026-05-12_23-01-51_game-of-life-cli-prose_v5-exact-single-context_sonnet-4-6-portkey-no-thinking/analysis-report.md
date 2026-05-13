# Analysis Report: 2026-05-12_23-01-51_game-of-life-cli-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-05-13T11:32:16+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-prose |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 498s |
| Started | 2026-05-12T23:01:51+00:00 |
| Ended | 2026-05-12T23:10:11+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, game-of-life.ts
- **Implementation LOC** (total): 55
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 26
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (6 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_23-01-51_game-of-life-cli-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_23-01-51_game-of-life-cli-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/game-of-life.spec.ts  (6 tests) 2ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  11:32:16
   Duration  347ms (transform 25ms, setup 0ms, collect 20ms, tests 2ms, environment 0ms, prepare 70ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 80% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 26 | ×1 | 26 |
| Invocations | 30 | ×2 | 60 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 5 | ×5 | 25 |
| Assignments | 19 | ×6 | 114 |
| **Total Mass** | | | **237** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 45 |
| Functions | 6 |
| Longest Function | 21 lines |
| Avg LOC/Function | 5.83 |
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
| McCabe (Cyclomatic) | 8 | 2.00 | 0 |
| Cognitive (SonarJS) | 9 | 4.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10239016 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 71.67s |
| Avg Red Phase | 19.69s |
| Avg Green Phase | 15.35s |
| Avg Refactor Phase | 36.63s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 12 |
| Predictions Total | 12 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


