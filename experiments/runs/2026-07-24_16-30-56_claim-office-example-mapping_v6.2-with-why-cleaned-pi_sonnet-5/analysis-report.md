# Analysis Report: 2026-07-24_16-30-56_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5

Generated: 2026-07-24T17:51:27+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | sonnet-5 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4830s |
| Started | 2026-07-24T16:30:56+00:00 |
| Ended | 2026-07-24T17:51:27+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 273
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 372
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_16-30-56_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_16-30-56_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5

 ✓ src/claim-office.spec.ts  (42 tests) 1146ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  17:51:28
   Duration  1.32s (transform 43ms, setup 0ms, collect 40ms, tests 1.15s, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 65% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 9 | ×5 | 45 |
| Assignments | 99 | ×6 | 594 |
| **Total Mass** | | | **898** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 225 |
| Functions | 25 |
| Longest Function | 14 lines |
| Avg LOC/Function | 4.76 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 5 | 1.75 | 0 |
| Cognitive (SonarJS) | 5 | 1.93 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3989581 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 58 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 49 |
| Predictions Total | 49 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 27 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


