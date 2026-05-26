# Analysis Report: 2026-05-25_15-10-20_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_opus-4-7-portkey-2

Generated: 2026-05-26T13:16:41+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | opus-4-7-portkey |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 678s |
| Started | 2026-05-25T15:10:20+00:00 |
| Ended | 2026-05-25T15:21:40+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 288
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 657
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-25_15-10-20_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_opus-4-7-portkey-2
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-25_15-10-20_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_opus-4-7-portkey-2

 ✓ src/claim-office.spec.ts  (39 tests) 158ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  13:16:43
   Duration  567ms (transform 44ms, setup 0ms, collect 40ms, tests 158ms, environment 0ms, prepare 107ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 96 | ×2 | 192 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 12 | ×5 | 60 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **762** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 248 |
| Functions | 16 |
| Longest Function | 22 lines |
| Avg LOC/Function | 8.69 |
| Median LOC/Function | 7.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.64 | 0 |
| Cognitive (SonarJS) | 8 | 3.31 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8181398 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


