# Analysis Report: 2026-08-05_02-03-30_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-3

Generated: 2026-08-05T02:48:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | opus-5-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2706s |
| Started | 2026-08-05T02:03:30+00:00 |
| Ended | 2026-08-05T02:48:38+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 322
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 643
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-05_02-03-30_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-05_02-03-30_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-3

 ✓ src/claim-office.spec.ts  (43 tests) 590ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  02:48:39
   Duration  760ms (transform 41ms, setup 0ms, collect 43ms, tests 590ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 12 | ×5 | 60 |
| Assignments | 77 | ×6 | 462 |
| **Total Mass** | | | **797** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 227 |
| Functions | 30 |
| Longest Function | 17 lines |
| Avg LOC/Function | 3.60 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 4 | 1.45 | 0 |
| Cognitive (SonarJS) | 4 | 1.82 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13200000 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 86 |
| Predictions Total | 86 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


