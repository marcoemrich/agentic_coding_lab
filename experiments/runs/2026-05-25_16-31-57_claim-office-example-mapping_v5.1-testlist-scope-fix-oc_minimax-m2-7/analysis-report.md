# Analysis Report: 2026-05-25_16-31-57_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_minimax-m2-7

Generated: 2026-05-25T16:53:37+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | minimax-m2-7 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1299s |
| Started | 2026-05-25T16:31:57+00:00 |
| Ended | 2026-05-25T16:53:37+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 200
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 108
- **Active tests**: 22
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (22 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_16-31-57_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_minimax-m2-7
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_16-31-57_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_minimax-m2-7

 ✓ src/claim-office.spec.ts  (22 tests) 4ms

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  16:53:38
   Duration  163ms (transform 33ms, setup 0ms, collect 29ms, tests 4ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 75% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 43 | ×2 | 86 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 5 | ×5 | 25 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **515** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 162 |
| Functions | 2 |
| Longest Function | 54 lines |
| Avg LOC/Function | 41.50 |
| Median LOC/Function | 41.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 1 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 12 | 4.38 | 1 |
| Cognitive (SonarJS) | 18 | 8.00 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5841448 |
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


