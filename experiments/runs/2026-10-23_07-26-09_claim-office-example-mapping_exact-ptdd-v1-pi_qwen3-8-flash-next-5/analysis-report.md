# Analysis Report: 2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next-5

Generated: 2026-10-23T07:51:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | qwen3-8-flash-next |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1531s |
| Started | 2026-10-23T07:26:10+00:00 |
| Ended | 2026-10-23T07:51:47+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, node.d.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 286
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 341
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next-5

 ✓ src/claim-office.spec.ts  (41 tests) 9ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  07:51:48
   Duration  336ms (transform 103ms, setup 0ms, collect 107ms, tests 9ms, environment 0ms, prepare 75ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 72 | ×1 | 72 |
| Invocations | 85 | ×2 | 170 |
| Conditionals | 22 | ×4 | 88 |
| Loops | 10 | ×5 | 50 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **752** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 249 |
| Functions | 18 |
| Longest Function | 30 lines |
| Avg LOC/Function | 8.50 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 6 | 2.63 | 0 |
| Cognitive (SonarJS) | 6 | 2.47 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15942668 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 47 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 72 |
| Predictions Total | 72 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 42 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


