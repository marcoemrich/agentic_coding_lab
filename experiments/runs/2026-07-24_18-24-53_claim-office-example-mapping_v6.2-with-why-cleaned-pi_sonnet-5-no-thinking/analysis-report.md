# Analysis Report: 2026-07-24_18-24-53_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5-no-thinking

Generated: 2026-07-24T19:36:50+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | sonnet-5-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4314s |
| Started | 2026-07-24T18:24:53+00:00 |
| Ended | 2026-07-24T19:36:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 323
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 585
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_18-24-53_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_18-24-53_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 6ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  19:36:50
   Duration  191ms (transform 46ms, setup 0ms, collect 46ms, tests 6ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 78 | ×1 | 78 |
| Invocations | 108 | ×2 | 216 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 18 | ×5 | 90 |
| Assignments | 72 | ×6 | 432 |
| **Total Mass** | | | **884** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 240 |
| Functions | 25 |
| Longest Function | 16 lines |
| Avg LOC/Function | 6.08 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 4 | 1.63 | 0 |
| Cognitive (SonarJS) | 3 | 1.83 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3040962 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 46 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 38 |
| Predictions Total | 38 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


