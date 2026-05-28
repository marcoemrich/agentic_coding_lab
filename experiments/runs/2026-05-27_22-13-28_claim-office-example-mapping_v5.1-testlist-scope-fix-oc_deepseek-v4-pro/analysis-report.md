# Analysis Report: 2026-05-27_22-13-28_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-pro

Generated: 2026-05-27T22:34:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | deepseek-v4-pro |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1286s |
| Started | 2026-05-27T22:13:28+00:00 |
| Ended | 2026-05-27T22:34:55+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts
- **Implementation LOC** (total): 237
- **Test file**: premium.spec.ts
- **Test file LOC**: 123
- **Active tests**: 26
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-27_22-13-28_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-pro
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-27_22-13-28_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-pro

 ✓ src/premium.spec.ts  (26 tests) 6ms
 ✓ src/claim.spec.ts  (17 tests) 4ms
 ✓ src/cli.spec.ts  (5 tests) 5ms

 Test Files  3 passed (3)
      Tests  48 passed (48)
   Start at  22:34:55
   Duration  472ms (transform 62ms, setup 0ms, collect 80ms, tests 15ms, environment 0ms, prepare 138ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 70 | ×1 | 70 |
| Invocations | 63 | ×2 | 126 |
| Conditionals | 22 | ×4 | 88 |
| Loops | 8 | ×5 | 40 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **666** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 202 |
| Functions | 5 |
| Longest Function | 57 lines |
| Avg LOC/Function | 30.40 |
| Median LOC/Function | 25.00 |
| Imports | 3 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 14 |
| Code Quality | 0 |
| **Total** | **18** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 13 | 3.73 | 2 |
| Cognitive (SonarJS) | 21 | 12.50 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8495227 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


