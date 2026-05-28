# Analysis Report: 2026-05-28_06-50-33_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-pro

Generated: 2026-05-28T07:10:00+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | deepseek-v4-pro |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1165s |
| Started | 2026-05-28T06:50:33+00:00 |
| Ended | 2026-05-28T07:10:00+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, process.ts, quote.ts
- **Implementation LOC** (total): 223
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 317
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-28_06-50-33_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-pro
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-28_06-50-33_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-pro

 ✓ src/claim-office.spec.ts  (50 tests) 8ms

 Test Files  1 passed (1)
      Tests  50 passed (50)
   Start at  07:10:01
   Duration  229ms (transform 55ms, setup 0ms, collect 62ms, tests 8ms, environment 0ms, prepare 58ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 63 | ×2 | 126 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 9 | ×5 | 45 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **616** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 197 |
| Functions | 8 |
| Longest Function | 39 lines |
| Avg LOC/Function | 10.62 |
| Median LOC/Function | 6.00 |
| Imports | 3 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 3.07 | 0 |
| Cognitive (SonarJS) | 21 | 7.67 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5771010 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 3 |
| Predictions Total | 3 |
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


