# Analysis Report: 2026-08-05_02-03-30_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-2

Generated: 2026-08-05T02:47:28+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | opus-5-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2637s |
| Started | 2026-08-05T02:03:30+00:00 |
| Ended | 2026-08-05T02:47:28+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 274
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 406
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-05_02-03-30_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-05_02-03-30_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty-2

 ✓ src/claim-office.spec.ts  (38 tests) 132ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  02:47:29
   Duration  312ms (transform 47ms, setup 0ms, collect 49ms, tests 132ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 65 | ×2 | 130 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 9 | ×5 | 45 |
| Assignments | 81 | ×6 | 486 |
| **Total Mass** | | | **749** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 209 |
| Functions | 31 |
| Longest Function | 13 lines |
| Avg LOC/Function | 2.94 |
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
| McCabe (Cyclomatic) | 3 | 1.29 | 0 |
| Cognitive (SonarJS) | 2 | 1.09 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16477707 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 41 |
| Predictions Total | 42 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


