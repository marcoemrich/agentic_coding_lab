# Analysis Report: 2026-10-23_03-50-59_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3

Generated: 2026-10-23T04:09:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | glm-5-3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1120s |
| Started | 2026-10-23T03:51:00+00:00 |
| Ended | 2026-10-23T04:09:44+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 373
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 661
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_03-50-59_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_03-50-59_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3

 ✓ src/claim-office.spec.ts  (43 tests) 1062ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  04:09:45
   Duration  1.45s (transform 130ms, setup 0ms, collect 101ms, tests 1.06s, environment 0ms, prepare 101ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 74 | ×1 | 74 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 22 | ×5 | 110 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **730** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 287 |
| Functions | 17 |
| Longest Function | 24 lines |
| Avg LOC/Function | 6.59 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 7 | 2.09 | 0 |
| Cognitive (SonarJS) | 9 | 3.22 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16123751 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 84 |
| Predictions Total | 86 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 44 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


