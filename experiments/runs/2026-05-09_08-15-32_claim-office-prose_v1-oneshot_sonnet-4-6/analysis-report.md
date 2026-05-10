# Analysis Report: 2026-05-09_08-15-32_claim-office-prose_v1-oneshot_sonnet-4-6

Generated: 2026-05-10T14:55:22+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v1-oneshot |
| Model | sonnet-4-6 |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 369s |
| Started | 2026-05-09T08:15:32+00:00 |
| Ended | 2026-05-09T08:21:44+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, types.ts
- **Implementation LOC** (total): 230
- **Test file**: claim.spec.ts
- **Test file LOC**: 182
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-15-32_claim-office-prose_v1-oneshot_sonnet-4-6
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-15-32_claim-office-prose_v1-oneshot_sonnet-4-6

 ✓ src/quote.spec.ts  (20 tests) 6ms
 ✓ src/claim.spec.ts  (14 tests) 4ms

 Test Files  2 passed (2)
      Tests  34 passed (34)
   Start at  14:55:23
   Duration  359ms (transform 43ms, setup 1ms, collect 52ms, tests 10ms, environment 0ms, prepare 198ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 78% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 58 | ×2 | 116 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 6 | ×5 | 30 |
| Assignments | 65 | ×6 | 390 |
| **Total Mass** | | | **652** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 186 |
| Functions | 7 |
| Longest Function | 27 lines |
| Avg LOC/Function | 9.14 |
| Median LOC/Function | 5.00 |
| Imports | 5 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 3.50 | 0 |
| Cognitive (SonarJS) | 14 | 4.80 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2198828 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 55.12s |
| Avg Red Phase | 39.74s |
| Avg Green Phase | 15.38s |
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
| Tests Passed Immediately | 0 |


