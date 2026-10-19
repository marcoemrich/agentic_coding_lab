# Analysis Report: 2026-10-19_06-23-54_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty

Generated: 2026-10-19T06:28:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-single-context-v2-testlist-fix-oc |
| Model | deepseek-v4-pro-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 264s |
| Started | 2026-10-19T06:23:54+00:00 |
| Ended | 2026-10-19T06:28:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 259
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 349
- **Active tests**: 32
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (32 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_06-23-54_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_06-23-54_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty

 ✓ src/claim-office.spec.ts  (32 tests) 6ms

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  06:28:20
   Duration  181ms (transform 44ms, setup 0ms, collect 39ms, tests 6ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 93 | ×2 | 186 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 11 | ×5 | 55 |
| Assignments | 78 | ×6 | 468 |
| **Total Mass** | | | **855** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 230 |
| Functions | 17 |
| Longest Function | 21 lines |
| Avg LOC/Function | 9.65 |
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
| McCabe (Cyclomatic) | 6 | 2.52 | 0 |
| Cognitive (SonarJS) | 8 | 3.36 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3332301 |
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


