# Analysis Report: 2026-08-05_02-03-30_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty

Generated: 2026-08-05T02:52:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | opus-5-requesty |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2924s |
| Started | 2026-08-05T02:03:30+00:00 |
| Ended | 2026-08-05T02:52:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 343
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 547
- **Active tests**: 35
- **Remaining todos**: 2

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-05_02-03-30_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-05_02-03-30_claim-office-example-mapping_v6.2.1-phase-continuation-pi_opus-5-requesty

 ✓ src/claim-office.spec.ts  (37 tests | 2 skipped) 902ms

 Test Files  1 passed (1)
      Tests  35 passed | 2 todo (37)
   Start at  02:52:15
   Duration  1.09s (transform 43ms, setup 0ms, collect 42ms, tests 902ms, environment 0ms, prepare 53ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 22 | ×5 | 110 |
| Assignments | 75 | ×6 | 450 |
| **Total Mass** | | | **815** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 227 |
| Functions | 28 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.29 |
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
| McCabe (Cyclomatic) | 4 | 1.46 | 0 |
| Cognitive (SonarJS) | 4 | 1.43 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16583633 |
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
| Predictions Correct | 42 |
| Predictions Total | 42 |
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


