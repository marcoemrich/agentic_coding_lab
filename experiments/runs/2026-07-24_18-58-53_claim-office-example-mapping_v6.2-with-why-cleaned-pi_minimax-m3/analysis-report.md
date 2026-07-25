# Analysis Report: 2026-07-24_18-58-53_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3

Generated: 2026-07-24T20:59:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | minimax-m3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 7207s |
| Started | 2026-07-24T18:58:53+00:00 |
| Ended | 2026-07-24T20:59:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 122
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 205
- **Active tests**: 17
- **Remaining todos**: 51

## Test Results

**Status**: ✅ All tests passing (17 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_18-58-53_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_18-58-53_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3

 ✓ src/claim-office.spec.ts  (68 tests | 51 skipped) 4ms

 Test Files  1 passed (1)
      Tests  17 passed | 51 todo (68)
   Start at  20:59:07
   Duration  162ms (transform 30ms, setup 0ms, collect 29ms, tests 4ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 19 | ×1 | 19 |
| Invocations | 16 | ×2 | 32 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 7 | ×5 | 35 |
| Assignments | 21 | ×6 | 126 |
| **Total Mass** | | | **232** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 87 |
| Functions | 4 |
| Longest Function | 14 lines |
| Avg LOC/Function | 6.25 |
| Median LOC/Function | 4.50 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 5 | 2.50 | 0 |
| Cognitive (SonarJS) | 5 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2956880 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 17 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 24 |
| Predictions Total | 24 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


