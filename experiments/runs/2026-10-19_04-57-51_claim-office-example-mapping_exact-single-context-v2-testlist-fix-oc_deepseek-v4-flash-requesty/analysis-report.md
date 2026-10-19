# Analysis Report: 2026-10-19_04-57-51_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty

Generated: 2026-10-19T05:08:04+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-single-context-v2-testlist-fix-oc |
| Model | deepseek-v4-flash-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 610s |
| Started | 2026-10-19T04:57:52+00:00 |
| Ended | 2026-10-19T05:08:04+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 197
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 365
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (49 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_04-57-51_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_04-57-51_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty

 ✓ src/claim-office.spec.ts  (49 tests) 1414ms

 Test Files  1 passed (1)
      Tests  49 passed (49)
   Start at  05:08:05
   Duration  1.59s (transform 52ms, setup 0ms, collect 46ms, tests 1.41s, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 10 | ×5 | 50 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **651** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 174 |
| Functions | 13 |
| Longest Function | 23 lines |
| Avg LOC/Function | 8.00 |
| Median LOC/Function | 7.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 8 | 2.94 | 0 |
| Cognitive (SonarJS) | 10 | 4.44 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4265050 |
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
| Predictions Correct | 7 |
| Predictions Total | 7 |
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


