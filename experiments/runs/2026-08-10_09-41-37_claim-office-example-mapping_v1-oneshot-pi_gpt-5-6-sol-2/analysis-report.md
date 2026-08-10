# Analysis Report: 2026-08-10_09-41-37_claim-office-example-mapping_v1-oneshot-pi_gpt-5-6-sol-2

Generated: 2026-08-10T09:44:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v1-oneshot-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 143s |
| Started | 2026-08-10T09:41:37+00:00 |
| Ended | 2026-08-10T09:44:02+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 247
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 52
- **Active tests**: 4
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (4 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_09-41-37_claim-office-example-mapping_v1-oneshot-pi_gpt-5-6-sol-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_09-41-37_claim-office-example-mapping_v1-oneshot-pi_gpt-5-6-sol-2

 ✓ src/claim-office.spec.ts  (4 tests) 4ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  09:44:03
   Duration  181ms (transform 32ms, setup 0ms, collect 29ms, tests 4ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 77% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 81 | ×1 | 81 |
| Invocations | 118 | ×2 | 236 |
| Conditionals | 28 | ×4 | 112 |
| Loops | 12 | ×5 | 60 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **831** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 218 |
| Functions | 17 |
| Longest Function | 21 lines |
| Avg LOC/Function | 8.29 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 10 | 2.96 | 0 |
| Cognitive (SonarJS) | 10 | 3.77 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 119239 |
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


