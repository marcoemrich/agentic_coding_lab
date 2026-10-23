# Analysis Report: 2026-10-23_03-17-50_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3

Generated: 2026-10-23T03:36:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | glm-5-3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1112s |
| Started | 2026-10-23T03:17:51+00:00 |
| Ended | 2026-10-23T03:36:26+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, office.ts, premium.ts
- **Implementation LOC** (total): 314
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 425
- **Active tests**: 47
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_03-17-50_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_03-17-50_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3

 ✓ src/claim-office.spec.ts  (47 tests) 862ms

 Test Files  1 passed (1)
      Tests  47 passed (47)
   Start at  03:36:28
   Duration  1.41s (transform 232ms, setup 0ms, collect 123ms, tests 862ms, environment 0ms, prepare 182ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 77 | ×1 | 77 |
| Invocations | 103 | ×2 | 206 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 14 | ×5 | 70 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **735** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 246 |
| Functions | 17 |
| Longest Function | 23 lines |
| Avg LOC/Function | 9.00 |
| Median LOC/Function | 7.00 |
| Imports | 9 |

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
| McCabe (Cyclomatic) | 7 | 2.52 | 0 |
| Cognitive (SonarJS) | 9 | 3.42 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9249327 |
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
| Predictions Correct | 95 |
| Predictions Total | 95 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 47 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


