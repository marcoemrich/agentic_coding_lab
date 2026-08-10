# Analysis Report: 2026-08-10_07-58-09_claim-office-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol

Generated: 2026-08-10T08:01:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 184s |
| Started | 2026-08-10T07:58:09+00:00 |
| Ended | 2026-08-10T08:01:14+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 160
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 74
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_07-58-09_claim-office-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_07-58-09_claim-office-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (35 tests) 6ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  08:01:15
   Duration  200ms (transform 33ms, setup 0ms, collect 30ms, tests 6ms, environment 0ms, prepare 61ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 63 | ×2 | 126 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 10 | ×5 | 50 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **563** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 138 |
| Functions | 8 |
| Longest Function | 24 lines |
| Avg LOC/Function | 8.50 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **16** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 3.60 | 0 |
| Cognitive (SonarJS) | 11 | 5.67 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 381315 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 36 |
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
| Refactorings Applied | 36 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


