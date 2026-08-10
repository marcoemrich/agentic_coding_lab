# Analysis Report: 2026-08-10_09-46-16_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol

Generated: 2026-08-10T09:51:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 297s |
| Started | 2026-08-10T09:46:16+00:00 |
| Ended | 2026-08-10T09:51:14+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 133
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 122
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (21 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_09-46-16_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_09-46-16_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (17 tests) 4ms
 ✓ src/cli.spec.ts  (4 tests) 425ms

 Test Files  2 passed (2)
      Tests  21 passed (21)
   Start at  09:51:15
   Duration  721ms (transform 34ms, setup 0ms, collect 37ms, tests 429ms, environment 0ms, prepare 87ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 53 | ×2 | 106 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 8 | ×5 | 40 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **567** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 121 |
| Functions | 10 |
| Longest Function | 17 lines |
| Avg LOC/Function | 5.70 |
| Median LOC/Function | 3.50 |
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
| McCabe (Cyclomatic) | 4 | 2.13 | 0 |
| Cognitive (SonarJS) | 3 | 2.12 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 496677 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


