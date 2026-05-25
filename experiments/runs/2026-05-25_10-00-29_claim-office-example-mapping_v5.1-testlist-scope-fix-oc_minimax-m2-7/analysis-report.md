# Analysis Report: 2026-05-25_10-00-29_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_minimax-m2-7

Generated: 2026-05-25T10:35:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | minimax-m2-7 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2114s |
| Started | 2026-05-25T10:00:29+00:00 |
| Ended | 2026-05-25T10:35:44+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 132
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 354
- **Active tests**: 37
- **Remaining todos**: 13

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_10-00-29_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_minimax-m2-7
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_10-00-29_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_minimax-m2-7

 ✓ src/claim-office.spec.ts  (50 tests | 13 skipped) 5ms

 Test Files  1 passed (1)
      Tests  37 passed | 13 todo (50)
   Start at  10:35:45
   Duration  169ms (transform 39ms, setup 0ms, collect 39ms, tests 5ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 28 | ×2 | 56 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 6 | ×5 | 30 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **484** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 114 |
| Functions | 3 |
| Longest Function | 41 lines |
| Avg LOC/Function | 29.33 |
| Median LOC/Function | 29.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **14** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 4.83 | 0 |
| Cognitive (SonarJS) | 19 | 7.20 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7502409 |
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
| Predictions Correct | 0 |
| Predictions Total | 2 |
| Accuracy | 0% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


