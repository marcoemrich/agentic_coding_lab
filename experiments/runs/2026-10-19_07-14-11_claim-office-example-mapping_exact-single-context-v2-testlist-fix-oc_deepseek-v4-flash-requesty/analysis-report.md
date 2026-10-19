# Analysis Report: 2026-10-19_07-14-11_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty

Generated: 2026-10-19T07:37:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-single-context-v2-testlist-fix-oc |
| Model | deepseek-v4-flash-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1419s |
| Started | 2026-10-19T07:14:11+00:00 |
| Ended | 2026-10-19T07:37:52+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 241
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 347
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_07-14-11_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_07-14-11_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty

 ✓ src/claim-office.spec.ts  (39 tests) 245ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  07:37:53
   Duration  407ms (transform 41ms, setup 0ms, collect 36ms, tests 245ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 72% |
| Branches | 84% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 77 | ×2 | 154 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 7 | ×5 | 35 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **684** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 217 |
| Functions | 13 |
| Longest Function | 24 lines |
| Avg LOC/Function | 10.08 |
| Median LOC/Function | 8.00 |
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
| McCabe (Cyclomatic) | 6 | 2.05 | 0 |
| Cognitive (SonarJS) | 7 | 3.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3291646 |
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
| Predictions Correct | 8 |
| Predictions Total | 8 |
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


