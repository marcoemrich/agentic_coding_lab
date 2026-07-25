# Analysis Report: 2026-07-25_04-10-15_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-sol

Generated: 2026-07-25T04:22:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 724s |
| Started | 2026-07-25T04:10:15+00:00 |
| Ended | 2026-07-25T04:22:21+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 102
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 135
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_04-10-15_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_04-10-15_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (16 tests) 6ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  04:22:22
   Duration  185ms (transform 44ms, setup 0ms, collect 43ms, tests 6ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 48 | ×2 | 96 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 8 | ×5 | 40 |
| Assignments | 37 | ×6 | 222 |
| **Total Mass** | | | **481** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 88 |
| Functions | 5 |
| Longest Function | 29 lines |
| Avg LOC/Function | 9.40 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.00 | 0 |
| Cognitive (SonarJS) | 8 | 2.22 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 653559 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 16 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


