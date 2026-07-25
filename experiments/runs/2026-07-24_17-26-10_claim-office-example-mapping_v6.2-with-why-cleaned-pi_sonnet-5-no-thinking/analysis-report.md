# Analysis Report: 2026-07-24_17-26-10_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5-no-thinking

Generated: 2026-07-24T18:56:27+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | sonnet-5-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 5416s |
| Started | 2026-07-24T17:26:10+00:00 |
| Ended | 2026-07-24T18:56:27+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, rounding.ts, scenario.ts
- **Implementation LOC** (total): 350
- **Test file**: claim.spec.ts
- **Test file LOC**: 153
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_17-26-10_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_17-26-10_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5-no-thinking

 ✓ src/quote.spec.ts  (21 tests) 4ms
 ✓ src/scenario.spec.ts  (8 tests) 4ms
 ✓ src/claim.spec.ts  (15 tests) 4ms

 Test Files  3 passed (3)
      Tests  44 passed (44)
   Start at  18:56:28
   Duration  430ms (transform 50ms, setup 0ms, collect 64ms, tests 12ms, environment 0ms, prepare 125ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 12 | ×5 | 60 |
| Assignments | 97 | ×6 | 582 |
| **Total Mass** | | | **898** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 274 |
| Functions | 30 |
| Longest Function | 19 lines |
| Avg LOC/Function | 3.43 |
| Median LOC/Function | 2.00 |
| Imports | 6 |

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
| McCabe (Cyclomatic) | 4 | 1.46 | 0 |
| Cognitive (SonarJS) | 4 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3800219 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 51 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 42 |
| Predictions Total | 42 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 25 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


