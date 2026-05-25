# Analysis Report: 2026-05-25_18-27-53_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1

Generated: 2026-05-25T18:54:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | glm-5-1 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1600s |
| Started | 2026-05-25T18:27:53+00:00 |
| Ended | 2026-05-25T18:54:34+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 201
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 335
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_18-27-53_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_18-27-53_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1

 ✓ src/claim-office.spec.ts  (37 tests) 9ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  18:54:35
   Duration  222ms (transform 67ms, setup 0ms, collect 66ms, tests 9ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 71 | ×1 | 71 |
| Invocations | 74 | ×2 | 148 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 10 | ×5 | 50 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **705** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 174 |
| Functions | 9 |
| Longest Function | 39 lines |
| Avg LOC/Function | 13.11 |
| Median LOC/Function | 10.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **14** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 3.62 | 0 |
| Cognitive (SonarJS) | 18 | 5.67 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10854742 |
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
| Predictions Correct | 3 |
| Predictions Total | 3 |
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


