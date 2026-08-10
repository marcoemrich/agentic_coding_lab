# Analysis Report: 2026-08-10_06-39-55_claim-office-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol-4

Generated: 2026-08-10T08:04:41+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.1-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 5084s |
| Started | 2026-08-10T06:39:55+00:00 |
| Ended | 2026-08-10T08:04:41+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 383
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 634
- **Active tests**: 48
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_06-39-55_claim-office-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_06-39-55_claim-office-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol-4

 ✓ src/claim-office.spec.ts  (48 tests) 8ms

 Test Files  1 passed (1)
      Tests  48 passed (48)
   Start at  08:04:46
   Duration  203ms (transform 58ms, setup 0ms, collect 58ms, tests 8ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 102 | ×1 | 102 |
| Invocations | 159 | ×2 | 318 |
| Conditionals | 36 | ×4 | 144 |
| Loops | 12 | ×5 | 60 |
| Assignments | 63 | ×6 | 378 |
| **Total Mass** | | | **1002** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 334 |
| Functions | 31 |
| Longest Function | 27 lines |
| Avg LOC/Function | 6.32 |
| Median LOC/Function | 4.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 18 |
| Code Quality | 0 |
| **Total** | **18** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 13 | 2.46 | 1 |
| Cognitive (SonarJS) | 8 | 2.24 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11365964 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 80 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 69 |
| Predictions Total | 100 |
| Accuracy | 69% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


