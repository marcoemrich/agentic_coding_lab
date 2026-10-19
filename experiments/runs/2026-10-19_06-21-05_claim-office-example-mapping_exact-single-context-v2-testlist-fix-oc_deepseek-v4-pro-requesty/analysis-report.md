# Analysis Report: 2026-10-19_06-21-05_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty

Generated: 2026-10-19T06:24:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-single-context-v2-testlist-fix-oc |
| Model | deepseek-v4-pro-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 177s |
| Started | 2026-10-19T06:21:06+00:00 |
| Ended | 2026-10-19T06:24:05+00:00 |

## Code Metrics

- **Implementation files**: cli.ts
- **Implementation LOC** (total): 177
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 377
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_06-21-05_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_06-21-05_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty

 ✓ src/claim-office.spec.ts  (36 tests) 6ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  06:24:06
   Duration  183ms (transform 47ms, setup 0ms, collect 40ms, tests 6ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 71 | ×2 | 142 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 9 | ×5 | 45 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **640** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 147 |
| Functions | 7 |
| Longest Function | 84 lines |
| Avg LOC/Function | 18.00 |
| Median LOC/Function | 7.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 8 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **24** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 21 | 2.87 | 1 |
| Cognitive (SonarJS) | 56 | 13.20 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2973576 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


