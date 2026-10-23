# Analysis Report: 2026-10-19_06-25-06_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty

Generated: 2026-10-19T06:29:10+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-single-context-v2-testlist-fix-oc |
| Model | deepseek-v4-flash-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 242s |
| Started | 2026-10-19T06:25:06+00:00 |
| Ended | 2026-10-19T06:29:10+00:00 |

## Code Metrics

- **Implementation files**: insurance.ts
- **Implementation LOC** (total): 21
- **Test files**: cli.spec.ts, insurance.spec.ts
- **Test LOC** (total): 68
- **Active tests**: 2
- **Remaining todos**: 39

## Test Results

**Status**: ✅ All tests passing (2 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_06-25-06_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_06-25-06_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty

 ✓ src/insurance.spec.ts  (35 tests | 33 skipped) 1ms
 ↓ src/cli.spec.ts  (6 tests | 6 skipped)

 Test Files  1 passed | 1 skipped (2)
      Tests  2 passed | 39 todo (41)
   Start at  06:29:11
   Duration  293ms (transform 33ms, setup 0ms, collect 27ms, tests 1ms, environment 0ms, prepare 92ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 6 | ×1 | 6 |
| Invocations | 2 | ×2 | 4 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 1 | ×5 | 5 |
| Assignments | 3 | ×6 | 18 |
| **Total Mass** | | | **45** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 19 |
| Functions | 1 |
| Longest Function | 6 lines |
| Avg LOC/Function | 6.00 |
| Median LOC/Function | 6.00 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 2 | 1.50 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 872606 |
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


