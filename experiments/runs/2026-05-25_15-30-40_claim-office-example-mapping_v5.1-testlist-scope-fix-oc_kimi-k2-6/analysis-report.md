# Analysis Report: 2026-05-25_15-30-40_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6

Generated: 2026-05-25T15:52:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | kimi-k2-6 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1294s |
| Started | 2026-05-25T15:30:40+00:00 |
| Ended | 2026-05-25T15:52:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 275
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 449
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_15-30-40_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_15-30-40_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6

 ✓ src/claim-office.spec.ts  (43 tests) 7ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  15:52:15
   Duration  186ms (transform 50ms, setup 0ms, collect 49ms, tests 7ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 26 | ×4 | 104 |
| Loops | 15 | ×5 | 75 |
| Assignments | 63 | ×6 | 378 |
| **Total Mass** | | | **781** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 215 |
| Functions | 7 |
| Longest Function | 40 lines |
| Avg LOC/Function | 16.00 |
| Median LOC/Function | 16.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 7 |
| Duplication | 0 |
| Magic Numbers | 14 |
| Code Quality | 0 |
| **Total** | **21** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 18 | 7.71 | 1 |
| Cognitive (SonarJS) | 22 | 12.17 | 4 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4522326 |
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
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


