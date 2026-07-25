# Analysis Report: 2026-07-25_03-12-09_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro

Generated: 2026-07-25T03:21:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | deepseek-v4-pro |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 582s |
| Started | 2026-07-25T03:12:09+00:00 |
| Ended | 2026-07-25T03:21:52+00:00 |

## Code Metrics

- **Implementation files**: cli.ts
- **Implementation LOC** (total): 286
- **Test file**: cli.spec.ts
- **Test file LOC**: 509
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_03-12-09_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_03-12-09_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro

 ✓ src/cli.spec.ts  (45 tests) 8ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  03:21:53
   Duration  213ms (transform 59ms, setup 0ms, collect 59ms, tests 8ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 99% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 63 | ×2 | 126 |
| Conditionals | 24 | ×4 | 96 |
| Loops | 10 | ×5 | 50 |
| Assignments | 84 | ×6 | 504 |
| **Total Mass** | | | **841** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 216 |
| Functions | 15 |
| Longest Function | 39 lines |
| Avg LOC/Function | 9.60 |
| Median LOC/Function | 6.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.83 | 0 |
| Cognitive (SonarJS) | 11 | 5.20 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 791064 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 21 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 22 |
| Predictions Total | 22 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


