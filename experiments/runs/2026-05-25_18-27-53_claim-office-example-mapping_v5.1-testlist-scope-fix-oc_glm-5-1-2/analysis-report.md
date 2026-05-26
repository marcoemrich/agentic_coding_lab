# Analysis Report: 2026-05-25_18-27-53_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1-2

Generated: 2026-05-26T13:19:56+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | glm-5-1 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1363s |
| Started | 2026-05-25T18:27:53+00:00 |
| Ended | 2026-05-25T18:50:37+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 211
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 395
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-25_18-27-53_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1-2
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-25_18-27-53_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1-2

 ✓ src/claim-office.spec.ts  (42 tests) 7ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  13:19:58
   Duration  404ms (transform 40ms, setup 0ms, collect 35ms, tests 7ms, environment 0ms, prepare 61ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 78 | ×1 | 78 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 10 | ×5 | 50 |
| Assignments | 73 | ×6 | 438 |
| **Total Mass** | | | **798** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 180 |
| Functions | 12 |
| Longest Function | 26 lines |
| Avg LOC/Function | 12.33 |
| Median LOC/Function | 9.50 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 7 | 3.06 | 0 |
| Cognitive (SonarJS) | 10 | 4.36 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7999255 |
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
| Predictions Correct | 6 |
| Predictions Total | 6 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


