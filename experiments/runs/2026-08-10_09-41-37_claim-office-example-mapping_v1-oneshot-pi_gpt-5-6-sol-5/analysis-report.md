# Analysis Report: 2026-08-10_09-41-37_claim-office-example-mapping_v1-oneshot-pi_gpt-5-6-sol-5

Generated: 2026-08-10T09:44:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v1-oneshot-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 166s |
| Started | 2026-08-10T09:41:37+00:00 |
| Ended | 2026-08-10T09:44:25+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 235
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 74
- **Active tests**: 4
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_09-41-37_claim-office-example-mapping_v1-oneshot-pi_gpt-5-6-sol-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_09-41-37_claim-office-example-mapping_v1-oneshot-pi_gpt-5-6-sol-5

 ✓ src/claim-office.spec.ts  (8 tests) 3ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  09:44:26
   Duration  172ms (transform 34ms, setup 0ms, collect 33ms, tests 3ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 82% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 89 | ×1 | 89 |
| Invocations | 121 | ×2 | 242 |
| Conditionals | 27 | ×4 | 108 |
| Loops | 11 | ×5 | 55 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **830** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 206 |
| Functions | 17 |
| Longest Function | 18 lines |
| Avg LOC/Function | 7.24 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 9 | 3.09 | 0 |
| Cognitive (SonarJS) | 10 | 2.65 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 139545 |
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
| Predictions Correct | N/A |
| Predictions Total | N/A |
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


