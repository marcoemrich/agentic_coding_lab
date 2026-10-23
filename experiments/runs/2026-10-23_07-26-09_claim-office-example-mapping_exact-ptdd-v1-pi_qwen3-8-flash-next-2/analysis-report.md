# Analysis Report: 2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next-2

Generated: 2026-10-23T07:54:10+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | qwen3-8-flash-next |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1674s |
| Started | 2026-10-23T07:26:10+00:00 |
| Ended | 2026-10-23T07:54:10+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, cli.ts, component.ts, payout.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 338
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 531
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_07-26-09_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8-flash-next-2

 ✓ src/claim-office.spec.ts  (38 tests) 227ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  07:54:11
   Duration  518ms (transform 83ms, setup 0ms, collect 79ms, tests 227ms, environment 0ms, prepare 75ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 104 | ×2 | 208 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 12 | ×5 | 60 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **738** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 292 |
| Functions | 25 |
| Longest Function | 30 lines |
| Avg LOC/Function | 5.64 |
| Median LOC/Function | 3.00 |
| Imports | 10 |

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
| McCabe (Cyclomatic) | 3 | 1.40 | 0 |
| Cognitive (SonarJS) | 3 | 1.38 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17412750 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 1 |
| Predictions Total | 1 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


