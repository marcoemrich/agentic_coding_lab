# Analysis Report: 2026-05-27_21-45-26_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-flash

Generated: 2026-05-27T22:13:12+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | deepseek-v4-flash |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1665s |
| Started | 2026-05-27T21:45:26+00:00 |
| Ended | 2026-05-27T22:13:12+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 211
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 576
- **Active tests**: 53
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (53 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-27_21-45-26_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-flash
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-27_21-45-26_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-flash

 ✓ src/claim-office.spec.ts  (53 tests) 9ms

 Test Files  1 passed (1)
      Tests  53 passed (53)
   Start at  22:13:12
   Duration  196ms (transform 55ms, setup 0ms, collect 54ms, tests 9ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 58 | ×2 | 116 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 10 | ×5 | 50 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **617** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 188 |
| Functions | 8 |
| Longest Function | 36 lines |
| Avg LOC/Function | 16.00 |
| Median LOC/Function | 15.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 4.78 | 1 |
| Cognitive (SonarJS) | 18 | 7.29 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12017927 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


