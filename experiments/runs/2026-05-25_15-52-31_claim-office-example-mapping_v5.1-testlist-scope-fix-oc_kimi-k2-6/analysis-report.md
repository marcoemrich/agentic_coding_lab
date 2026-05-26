# Analysis Report: 2026-05-25_15-52-31_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6

Generated: 2026-05-26T13:18:02+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | kimi-k2-6 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2349s |
| Started | 2026-05-25T15:52:31+00:00 |
| Ended | 2026-05-25T16:31:41+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 221
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 920
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-25_15-52-31_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-25_15-52-31_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6

 ✓ src/claim-office.spec.ts  (44 tests) 6ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  13:18:04
   Duration  387ms (transform 38ms, setup 0ms, collect 39ms, tests 6ms, environment 0ms, prepare 68ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 75 | ×1 | 75 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 13 | ×5 | 65 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **674** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 197 |
| Functions | 7 |
| Longest Function | 62 lines |
| Avg LOC/Function | 17.86 |
| Median LOC/Function | 13.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 5 |
| Duplication | 0 |
| Magic Numbers | 14 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 15 | 5.00 | 2 |
| Cognitive (SonarJS) | 19 | 8.71 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9305113 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


