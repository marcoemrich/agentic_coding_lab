# Analysis Report: 2026-07-24_16-18-19_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5

Generated: 2026-07-24T18:20:41+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | sonnet-5 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 7341s |
| Started | 2026-07-24T16:18:19+00:00 |
| Ended | 2026-07-24T18:20:41+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts
- **Implementation LOC** (total): 363
- **Test file**: premium.spec.ts
- **Test file LOC**: 165
- **Active tests**: 20
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_16-18-19_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_16-18-19_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5

 ✓ src/premium.spec.ts  (20 tests) 4ms
 ✓ src/claim.spec.ts  (18 tests) 4ms
 ✓ src/cli.spec.ts  (3 tests) 303ms

 Test Files  3 passed (3)
      Tests  41 passed (41)
   Start at  18:20:41
   Duration  711ms (transform 42ms, setup 1ms, collect 50ms, tests 311ms, environment 0ms, prepare 123ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 78% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 84 | ×2 | 168 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 14 | ×5 | 70 |
| Assignments | 91 | ×6 | 546 |
| **Total Mass** | | | **931** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 284 |
| Functions | 22 |
| Longest Function | 37 lines |
| Avg LOC/Function | 5.36 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.81 | 0 |
| Cognitive (SonarJS) | 3 | 1.79 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 66695 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


