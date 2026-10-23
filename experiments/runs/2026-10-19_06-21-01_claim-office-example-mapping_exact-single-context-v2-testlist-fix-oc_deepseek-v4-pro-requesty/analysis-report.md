# Analysis Report: 2026-10-19_06-21-01_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty

Generated: 2026-10-19T06:23:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-single-context-v2-testlist-fix-oc |
| Model | deepseek-v4-pro-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 168s |
| Started | 2026-10-19T06:21:01+00:00 |
| Ended | 2026-10-19T06:23:51+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 247
- **Test files**: office.spec.ts
- **Test LOC** (total): 312
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_06-21-01_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_06-21-01_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty

 ✓ src/office.spec.ts  (35 tests) 7ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  06:23:52
   Duration  195ms (transform 51ms, setup 0ms, collect 45ms, tests 7ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 84 | ×2 | 168 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 9 | ×5 | 45 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **722** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 217 |
| Functions | 15 |
| Longest Function | 18 lines |
| Avg LOC/Function | 5.93 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 7 | 2.84 | 0 |
| Cognitive (SonarJS) | 10 | 3.21 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2059515 |
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


