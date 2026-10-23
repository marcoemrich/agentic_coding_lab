# Analysis Report: 2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next-3

Generated: 2026-10-23T07:44:10+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | qwen3-8-flash-next |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1074s |
| Started | 2026-10-23T07:26:10+00:00 |
| Ended | 2026-10-23T07:44:10+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 317
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 811
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next-3

 ✓ src/claim-office.spec.ts  (39 tests) 1004ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  07:44:11
   Duration  1.31s (transform 87ms, setup 0ms, collect 77ms, tests 1.00s, environment 0ms, prepare 82ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 92 | ×2 | 184 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 11 | ×5 | 55 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **659** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 279 |
| Functions | 21 |
| Longest Function | 22 lines |
| Avg LOC/Function | 4.38 |
| Median LOC/Function | 3.00 |
| Imports | 3 |

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
| McCabe (Cyclomatic) | 4 | 1.68 | 0 |
| Cognitive (SonarJS) | 5 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12224172 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
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


