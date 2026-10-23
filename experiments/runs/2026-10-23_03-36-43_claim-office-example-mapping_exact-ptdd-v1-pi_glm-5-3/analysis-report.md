# Analysis Report: 2026-10-23_03-36-43_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3

Generated: 2026-10-23T03:56:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | glm-5-3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1186s |
| Started | 2026-10-23T03:36:44+00:00 |
| Ended | 2026-10-23T03:56:34+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, test-helpers.ts
- **Implementation LOC** (total): 428
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 816
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_03-36-43_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_03-36-43_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3

 ✓ src/claim-office.spec.ts  (42 tests) 9441ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  03:56:36
   Duration  10.16s (transform 293ms, setup 0ms, collect 199ms, tests 9.44s, environment 0ms, prepare 234ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 12% |
| Branches | 63% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 91 | ×1 | 91 |
| Invocations | 119 | ×2 | 238 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 23 | ×5 | 115 |
| Assignments | 70 | ×6 | 420 |
| **Total Mass** | | | **956** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 342 |
| Functions | 23 |
| Longest Function | 27 lines |
| Avg LOC/Function | 7.09 |
| Median LOC/Function | 5.00 |
| Imports | 5 |

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
| McCabe (Cyclomatic) | 9 | 2.09 | 0 |
| Cognitive (SonarJS) | 9 | 3.07 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10097284 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 82 |
| Predictions Total | 84 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 43 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


