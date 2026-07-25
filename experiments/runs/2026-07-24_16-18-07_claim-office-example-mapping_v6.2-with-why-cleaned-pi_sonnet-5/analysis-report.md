# Analysis Report: 2026-07-24_16-18-07_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5

Generated: 2026-07-24T17:25:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | sonnet-5 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4065s |
| Started | 2026-07-24T16:18:07+00:00 |
| Ended | 2026-07-24T17:25:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 334
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 597
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_16-18-07_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_16-18-07_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5

 ✓ src/claim-office.spec.ts  (34 tests) 6ms
 ✓ src/cli.spec.ts  (1 test) 286ms

 Test Files  2 passed (2)
      Tests  35 passed (35)
   Start at  17:25:54
   Duration  624ms (transform 53ms, setup 0ms, collect 82ms, tests 292ms, environment 0ms, prepare 84ms)
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
| Invocations | 85 | ×2 | 170 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 11 | ×5 | 55 |
| Assignments | 100 | ×6 | 600 |
| **Total Mass** | | | **938** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 284 |
| Functions | 26 |
| Longest Function | 19 lines |
| Avg LOC/Function | 4.62 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.76 | 0 |
| Cognitive (SonarJS) | 5 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2555918 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 52 |
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


