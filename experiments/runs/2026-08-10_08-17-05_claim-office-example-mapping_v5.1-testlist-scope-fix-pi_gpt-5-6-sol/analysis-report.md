# Analysis Report: 2026-08-10_08-17-05_claim-office-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol

Generated: 2026-08-10T08:20:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 231s |
| Started | 2026-08-10T08:17:05+00:00 |
| Ended | 2026-08-10T08:20:58+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 156
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 98
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_08-17-05_claim-office-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_08-17-05_claim-office-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (37 tests) 16ms
 ✓ src/cli.spec.ts  (2 tests) 156ms

 Test Files  2 passed (2)
      Tests  39 passed (39)
   Start at  08:20:59
   Duration  484ms (transform 35ms, setup 0ms, collect 38ms, tests 172ms, environment 0ms, prepare 94ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 61 | ×2 | 122 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 9 | ×5 | 45 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **560** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 136 |
| Functions | 8 |
| Longest Function | 21 lines |
| Avg LOC/Function | 10.00 |
| Median LOC/Function | 8.50 |
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
| McCabe (Cyclomatic) | 8 | 2.62 | 0 |
| Cognitive (SonarJS) | 8 | 2.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 715642 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 10 |
| Predictions Total | 12 |
| Accuracy | 83% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


