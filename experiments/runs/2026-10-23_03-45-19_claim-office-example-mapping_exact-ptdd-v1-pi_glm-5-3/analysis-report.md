# Analysis Report: 2026-10-23_03-45-19_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3

Generated: 2026-10-23T04:01:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | glm-5-3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 994s |
| Started | 2026-10-23T03:45:20+00:00 |
| Ended | 2026-10-23T04:01:58+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 318
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 366
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_03-45-19_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_03-45-19_claim-office-example-mapping_exact-ptdd-v1-pi_glm-5-3

 ✓ src/claim-office.spec.ts  (50 tests) 641ms

 Test Files  1 passed (1)
      Tests  50 passed (50)
   Start at  04:01:59
   Duration  973ms (transform 120ms, setup 0ms, collect 109ms, tests 641ms, environment 0ms, prepare 77ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 82% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 89 | ×1 | 89 |
| Invocations | 113 | ×2 | 226 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 10 | ×5 | 50 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **853** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 256 |
| Functions | 21 |
| Longest Function | 22 lines |
| Avg LOC/Function | 7.38 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 10 | 2.24 | 0 |
| Cognitive (SonarJS) | 10 | 2.71 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7531954 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 101 |
| Predictions Total | 102 |
| Accuracy | 99% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 50 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


