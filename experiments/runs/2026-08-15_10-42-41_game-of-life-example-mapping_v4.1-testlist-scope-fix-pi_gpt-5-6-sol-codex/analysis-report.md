# Analysis Report: 2026-08-15_10-42-41_game-of-life-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol-codex

Generated: 2026-08-15T13:37:45+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4.1-testlist-scope-fix-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1130s |
| Started | 2026-08-15T10:42:41+00:00 |
| Ended | 2026-08-15T11:01:32+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 34
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 137
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-15_10-42-41_game-of-life-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-15_10-42-41_game-of-life-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol-codex

 ✓ src/game-of-life.spec.ts  (9 tests) 3ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  13:37:46
   Duration  459ms (transform 36ms, setup 0ms, collect 23ms, tests 3ms, environment 0ms, prepare 114ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 9 | ×1 | 9 |
| Invocations | 15 | ×2 | 30 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 5 | ×5 | 25 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **146** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 29 |
| Functions | 2 |
| Longest Function | 30 lines |
| Avg LOC/Function | 16.00 |
| Median LOC/Function | 16.00 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 7 | 2.80 | 0 |
| Cognitive (SonarJS) | 11 | 4.67 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1326704 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 18 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Tests Passed Immediately | 0 |


