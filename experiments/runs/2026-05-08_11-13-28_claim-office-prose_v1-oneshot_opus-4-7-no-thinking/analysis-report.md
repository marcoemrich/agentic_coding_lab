# Analysis Report: 2026-05-08_11-13-28_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

Generated: 2026-05-09T11:09:24+02:00

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

- **Implementation file**: engine.ts
- **Implementation LOC**: 48
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

 ✓ src/claims.spec.ts  (5 tests) 1ms
 ✓ src/pricing.spec.ts  (12 tests) 2ms
 ✓ src/engine.spec.ts  (3 tests) 2ms

 Test Files  3 passed (3)
      Tests  20 passed (20)
   Start at  11:09:24
   Duration  343ms (transform 72ms, setup 0ms, collect 90ms, tests 5ms, environment 1ms, prepare 265ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 7 | ×1 | 7 |
| Invocations | 12 | ×2 | 24 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 1 | ×5 | 5 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **116** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 45 |
| Functions | 1 |
| Longest Function | 37 lines |
| Avg LOC/Function | 37 |
| Imports | 3 |

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


