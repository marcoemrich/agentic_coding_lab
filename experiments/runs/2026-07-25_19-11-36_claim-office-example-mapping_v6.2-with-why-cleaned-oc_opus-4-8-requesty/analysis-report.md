# Analysis Report: 2026-07-25_19-11-36_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-8-requesty

Generated: 2026-07-25T19:50:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-oc |
| Model | opus-4-8-requesty |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 2356s |
| Started | 2026-07-25T19:11:36+00:00 |
| Ended | 2026-07-25T19:50:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 310
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 453
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_19-11-36_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-8-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_19-11-36_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-8-requesty

 ✓ src/claim-office.spec.ts  (36 tests) 10ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  19:50:53
   Duration  210ms (transform 47ms, setup 0ms, collect 44ms, tests 10ms, environment 0ms, prepare 58ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 81 | ×2 | 162 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 11 | ×5 | 55 |
| Assignments | 89 | ×6 | 534 |
| **Total Mass** | | | **847** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 262 |
| Functions | 25 |
| Longest Function | 18 lines |
| Avg LOC/Function | 5.60 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.50 | 0 |
| Cognitive (SonarJS) | 4 | 1.64 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 34476244 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 36 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 70 |
| Predictions Total | 71 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


