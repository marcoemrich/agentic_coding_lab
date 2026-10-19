# Analysis Report: 2026-10-19_06-26-09_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty

Generated: 2026-10-19T06:52:00+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-single-context-v2-testlist-fix-oc |
| Model | deepseek-v4-flash-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1549s |
| Started | 2026-10-19T06:26:09+00:00 |
| Ended | 2026-10-19T06:52:00+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 242
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 811
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_06-26-09_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_06-26-09_claim-office-example-mapping_exact-single-context-v2-testlist-fix-oc_deepseek-v4-flash-requesty

 ✓ src/claim-office.spec.ts  (36 tests) 6ms
 ✓ src/cli.spec.ts  (4 tests) 392ms

 Test Files  2 passed (2)
      Tests  40 passed (40)
   Start at  06:52:00
   Duration  702ms (transform 56ms, setup 0ms, collect 51ms, tests 398ms, environment 0ms, prepare 92ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 11 | ×5 | 55 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **656** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 223 |
| Functions | 15 |
| Longest Function | 25 lines |
| Avg LOC/Function | 9.40 |
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
| McCabe (Cyclomatic) | 6 | 2.29 | 0 |
| Cognitive (SonarJS) | 8 | 2.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 21937914 |
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
| Predictions Correct | 61 |
| Predictions Total | 61 |
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


