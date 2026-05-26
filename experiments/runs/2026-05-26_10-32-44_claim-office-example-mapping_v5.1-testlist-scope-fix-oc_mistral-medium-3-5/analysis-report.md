# Analysis Report: 2026-05-26_10-32-44_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5

Generated: 2026-05-26T14:01:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | mistral-medium-3-5 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 12529s |
| Started | 2026-05-26T10:32:44+00:00 |
| Ended | 2026-05-26T14:01:34+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 279
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 688
- **Active tests**: 58
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (128 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_10-32-44_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_10-32-44_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5

 ✓ src/claim-office.spec.ts  (58 tests) 6ms
 ✓ src/quote.spec.ts  (40 tests) 5ms
 ✓ src/claim.spec.ts  (24 tests) 4ms
 ✓ src/cli.spec.ts  (6 tests) 4ms

 Test Files  4 passed (4)
      Tests  128 passed (128)
   Start at  14:01:35
   Duration  606ms (transform 74ms, setup 0ms, collect 103ms, tests 19ms, environment 0ms, prepare 178ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 107 | ×1 | 107 |
| Invocations | 73 | ×2 | 146 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 28 | ×5 | 140 |
| Assignments | 73 | ×6 | 438 |
| **Total Mass** | | | **923** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 175 |
| Functions | 1 |
| Longest Function | 256 lines |
| Avg LOC/Function | 256.00 |
| Median LOC/Function | 256.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 12 |
| Duplication | 0 |
| Magic Numbers | 20 |
| Code Quality | 0 |
| **Total** | **32** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 39 | 11.00 | 1 |
| Cognitive (SonarJS) | 98 | 50.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10963623 |
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
| Predictions Correct | 4 |
| Predictions Total | 4 |
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


