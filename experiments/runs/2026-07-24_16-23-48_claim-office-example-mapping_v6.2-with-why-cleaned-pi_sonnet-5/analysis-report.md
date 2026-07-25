# Analysis Report: 2026-07-24_16-23-48_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5

Generated: 2026-07-25T20:25:52+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | sonnet-5 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 5761s |
| Started | 2026-07-24T16:23:48+00:00 |
| Ended | 2026-07-24T17:59:50+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claim.ts, cli.ts, quote.ts, rounding.ts, scenario.ts
- **Implementation LOC** (total): 267
- **Test file**: catalog.spec.ts
- **Test file LOC**: 66
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (53 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_16-23-48_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_16-23-48_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5

 ✓ src/rounding.spec.ts  (2 tests) 1ms
 ✓ src/quote.spec.ts  (10 tests) 3ms
 ✓ src/catalog.spec.ts  (16 tests) 3ms
 ✓ src/scenario.spec.ts  (6 tests) 4ms
 ✓ src/claim.spec.ts  (15 tests) 4ms
 ✓ src/cli.spec.ts  (4 tests) 1265ms

 Test Files  6 passed (6)
      Tests  53 passed (53)
   Start at  20:25:53
   Duration  1.62s (transform 128ms, setup 0ms, collect 234ms, tests 1.28s, environment 1ms, prepare 621ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 69 | ×2 | 138 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 9 | ×5 | 45 |
| Assignments | 76 | ×6 | 456 |
| **Total Mass** | | | **755** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 219 |
| Functions | 24 |
| Longest Function | 10 lines |
| Avg LOC/Function | 4.92 |
| Median LOC/Function | 5.50 |
| Imports | 8 |

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
| McCabe (Cyclomatic) | 4 | 1.67 | 0 |
| Cognitive (SonarJS) | 3 | 1.38 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 40068004 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 57 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 56 |
| Predictions Total | 58 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 30 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


