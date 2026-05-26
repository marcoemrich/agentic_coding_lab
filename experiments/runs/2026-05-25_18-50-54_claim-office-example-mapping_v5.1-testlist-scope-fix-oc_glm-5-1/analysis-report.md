# Analysis Report: 2026-05-25_18-50-54_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1

Generated: 2026-05-26T13:20:23+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | glm-5-1 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2109s |
| Started | 2026-05-25T18:50:54+00:00 |
| Ended | 2026-05-25T19:26:04+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 244
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 434
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-25_18-50-54_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-25_18-50-54_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1

 ✓ src/claim-office.spec.ts  (43 tests) 8ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  13:20:25
   Duration  386ms (transform 38ms, setup 0ms, collect 40ms, tests 8ms, environment 0ms, prepare 73ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 92 | ×2 | 184 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 10 | ×5 | 50 |
| Assignments | 78 | ×6 | 468 |
| **Total Mass** | | | **859** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 224 |
| Functions | 14 |
| Longest Function | 26 lines |
| Avg LOC/Function | 12.00 |
| Median LOC/Function | 10.50 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 3.47 | 0 |
| Cognitive (SonarJS) | 10 | 3.69 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15137424 |
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
| Predictions Correct | 3 |
| Predictions Total | 3 |
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


