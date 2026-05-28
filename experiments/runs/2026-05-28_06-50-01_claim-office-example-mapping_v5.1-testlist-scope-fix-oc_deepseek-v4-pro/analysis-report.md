# Analysis Report: 2026-05-28_06-50-01_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-pro

Generated: 2026-05-28T07:04:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | deepseek-v4-pro |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 894s |
| Started | 2026-05-28T06:50:01+00:00 |
| Ended | 2026-05-28T07:04:56+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts
- **Implementation LOC** (total): 309
- **Test file**: premium.spec.ts
- **Test file LOC**: 82
- **Active tests**: 23
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-28_06-50-01_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-pro
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-28_06-50-01_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-pro

 ✓ src/premium.spec.ts  (23 tests) 4ms
 ✓ src/claim.spec.ts  (11 tests) 4ms

 Test Files  2 passed (2)
      Tests  34 passed (34)
   Start at  07:04:57
   Duration  392ms (transform 48ms, setup 0ms, collect 54ms, tests 8ms, environment 0ms, prepare 118ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 50% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 83 | ×1 | 83 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 30 | ×4 | 120 |
| Loops | 13 | ×5 | 65 |
| Assignments | 67 | ×6 | 402 |
| **Total Mass** | | | **844** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 260 |
| Functions | 7 |
| Longest Function | 68 lines |
| Avg LOC/Function | 17.71 |
| Median LOC/Function | 10.00 |
| Imports | 3 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 10 |
| Duplication | 0 |
| Magic Numbers | 14 |
| Code Quality | 1 |
| **Total** | **25** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 17 | 5.70 | 2 |
| Cognitive (SonarJS) | 29 | 10.86 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3350867 |
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


