# Analysis Report: 2026-10-19_04-57-51_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty

Generated: 2026-10-19T05:04:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-single-context-v2-testlist-fix-oc |
| Model | deepseek-v4-pro-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 372s |
| Started | 2026-10-19T04:57:52+00:00 |
| Ended | 2026-10-19T05:04:06+00:00 |

## Code Metrics

- **Implementation files**: cli.ts
- **Implementation LOC** (total): 147
- **Test files**: cli.spec.ts
- **Test LOC** (total): 175
- **Active tests**: 21
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (21 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_04-57-51_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_04-57-51_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-pro-requesty

Unexpected end of JSON input ✓ src/cli.spec.ts  (21 tests) 4ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  05:04:07
   Duration  174ms (transform 47ms, setup 0ms, collect 36ms, tests 4ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 74 | ×2 | 148 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 8 | ×5 | 40 |
| Assignments | 43 | ×6 | 258 |
| **Total Mass** | | | **589** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 136 |
| Functions | 10 |
| Longest Function | 28 lines |
| Avg LOC/Function | 13.00 |
| Median LOC/Function | 13.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 17 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 3.00 | 0 |
| Cognitive (SonarJS) | 8 | 4.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6020819 |
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


