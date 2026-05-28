# Analysis Report: 2026-05-28_06-24-10_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-flash-2

Generated: 2026-05-28T06:50:17+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | deepseek-v4-flash |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1566s |
| Started | 2026-05-28T06:24:10+00:00 |
| Ended | 2026-05-28T06:50:17+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 215
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 315
- **Active tests**: 33
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (33 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-28_06-24-10_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-flash-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-28_06-24-10_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-flash-2

 ✓ src/claim-office.spec.ts  (33 tests) 6ms

 Test Files  1 passed (1)
      Tests  33 passed (33)
   Start at  06:50:17
   Duration  182ms (transform 38ms, setup 0ms, collect 37ms, tests 6ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 71 | ×1 | 71 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 14 | ×5 | 70 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **737** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 195 |
| Functions | 11 |
| Longest Function | 20 lines |
| Avg LOC/Function | 12.36 |
| Median LOC/Function | 11.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 2.80 | 0 |
| Cognitive (SonarJS) | 11 | 3.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6937973 |
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
| Predictions Correct | 1 |
| Predictions Total | 1 |
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


