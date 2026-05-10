# Analysis Report: 2026-05-08_11-13-28_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

Generated: 2026-05-10T14:52:56+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v1-oneshot |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 220s |
| Started | 2026-05-08T11:13:28+00:00 |
| Ended | 2026-05-08T11:17:11+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, engine.ts, pricing.ts, types.ts
- **Implementation LOC** (total): 327
- **Test file**: claims.spec.ts
- **Test file LOC**: 80
- **Active tests**: 5
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (20 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-13-28_claim-office-prose_v1-oneshot_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-13-28_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

 ✓ src/pricing.spec.ts  (12 tests) 3ms
 ✓ src/claims.spec.ts  (5 tests) 3ms
 ✓ src/engine.spec.ts  (3 tests) 3ms

 Test Files  3 passed (3)
      Tests  20 passed (20)
   Start at  14:52:57
   Duration  387ms (transform 62ms, setup 0ms, collect 81ms, tests 9ms, environment 1ms, prepare 310ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 87 | ×1 | 87 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 14 | ×5 | 70 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **785** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 263 |
| Functions | 13 |
| Longest Function | 37 lines |
| Avg LOC/Function | 9.38 |
| Median LOC/Function | 5.00 |
| Imports | 7 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **18** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.30 | 0 |
| Cognitive (SonarJS) | 12 | 4.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1755131 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 88.93s |
| Avg Red Phase | 26.3s |
| Avg Green Phase | 62.63s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | N/A |
| Predictions Total | N/A |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


