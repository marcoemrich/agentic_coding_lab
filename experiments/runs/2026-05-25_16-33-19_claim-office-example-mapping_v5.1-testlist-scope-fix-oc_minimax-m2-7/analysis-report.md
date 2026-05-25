# Analysis Report: 2026-05-25_16-33-19_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_minimax-m2-7

Generated: 2026-05-25T16:38:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | minimax-m2-7 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 303s |
| Started | 2026-05-25T16:33:19+00:00 |
| Ended | 2026-05-25T16:38:23+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 91
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 177
- **Active tests**: 2
- **Remaining todos**: 65

## Test Results

**Status**: ✅ All tests passing (2 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_16-33-19_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_minimax-m2-7
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_16-33-19_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_minimax-m2-7

 ✓ src/claim-office.spec.ts  (67 tests | 65 skipped) 3ms

 Test Files  1 passed (1)
      Tests  2 passed | 65 todo (67)
   Start at  16:38:24
   Duration  175ms (transform 30ms, setup 0ms, collect 30ms, tests 3ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 75% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 27 | ×1 | 27 |
| Invocations | 5 | ×2 | 10 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 0 | ×5 | 0 |
| Assignments | 6 | ×6 | 36 |
| **Total Mass** | | | **105** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 76 |
| Functions | 3 |
| Longest Function | 5 lines |
| Avg LOC/Function | 3.67 |
| Median LOC/Function | 3.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 2.00 | 0 |
| Cognitive (SonarJS) | 3 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 883444 |
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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


