# Analysis Report: 2026-08-10_08-31-42_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix-pi_gpt-5-6-sol

Generated: 2026-08-10T08:57:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1530s |
| Started | 2026-08-10T08:31:42+00:00 |
| Ended | 2026-08-10T08:57:13+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 107
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 222
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_08-31-42_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_08-31-42_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (35 tests) 335ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  08:57:14
   Duration  523ms (transform 46ms, setup 0ms, collect 47ms, tests 335ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 39 | ×2 | 78 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 7 | ×5 | 35 |
| Assignments | 28 | ×6 | 168 |
| **Total Mass** | | | **395** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 98 |
| Functions | 5 |
| Longest Function | 18 lines |
| Avg LOC/Function | 7.00 |
| Median LOC/Function | 3.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 2.54 | 0 |
| Cognitive (SonarJS) | 13 | 3.43 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6457103 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 36 |
| Predictions Total | 36 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


