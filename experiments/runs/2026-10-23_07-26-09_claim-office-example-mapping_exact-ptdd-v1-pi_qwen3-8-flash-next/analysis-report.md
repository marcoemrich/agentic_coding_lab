# Analysis Report: 2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next

Generated: 2026-10-23T07:55:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | qwen3-8-flash-next |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1783s |
| Started | 2026-10-23T07:26:10+00:00 |
| Ended | 2026-10-23T07:55:59+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claim.ts, cli.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 339
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 560
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next

 ✓ src/claim-office.spec.ts  (42 tests) 385ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  07:56:00
   Duration  676ms (transform 80ms, setup 0ms, collect 73ms, tests 385ms, environment 0ms, prepare 69ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 103 | ×2 | 206 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 10 | ×5 | 50 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **782** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 300 |
| Functions | 25 |
| Longest Function | 24 lines |
| Avg LOC/Function | 6.68 |
| Median LOC/Function | 6.00 |
| Imports | 7 |

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
| McCabe (Cyclomatic) | 8 | 1.68 | 0 |
| Cognitive (SonarJS) | 6 | 1.71 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 22147003 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


