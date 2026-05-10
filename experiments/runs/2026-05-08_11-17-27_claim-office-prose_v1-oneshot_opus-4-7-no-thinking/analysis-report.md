# Analysis Report: 2026-05-08_11-17-27_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

Generated: 2026-05-10T14:53:07+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v1-oneshot |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 239s |
| Started | 2026-05-08T11:17:27+00:00 |
| Ended | 2026-05-08T11:21:28+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, pricing.ts, quote.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 347
- **Test file**: claim.spec.ts
- **Test file LOC**: 74
- **Active tests**: 5
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (19 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-17-27_claim-office-prose_v1-oneshot_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-17-27_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

 ✓ src/claim.spec.ts  (5 tests) 2ms
 ✓ src/quote.spec.ts  (11 tests) 3ms
 ✓ src/scenario.spec.ts  (3 tests) 3ms

 Test Files  3 passed (3)
      Tests  19 passed (19)
   Start at  14:53:07
   Duration  416ms (transform 62ms, setup 0ms, collect 97ms, tests 8ms, environment 0ms, prepare 242ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 86 | ×1 | 86 |
| Invocations | 107 | ×2 | 214 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 8 | ×5 | 40 |
| Assignments | 70 | ×6 | 420 |
| **Total Mass** | | | **844** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 279 |
| Functions | 17 |
| Longest Function | 39 lines |
| Avg LOC/Function | 10.76 |
| Median LOC/Function | 6.00 |
| Imports | 9 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **12** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.21 | 0 |
| Cognitive (SonarJS) | 9 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2061367 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 77.35s |
| Avg Red Phase | 36.19s |
| Avg Green Phase | 41.16s |
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


