# Analysis Report: 2026-10-23_03-45-24_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash

Generated: 2026-10-23T03:57:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | deepseek-v4-1-flash |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 746s |
| Started | 2026-10-23T03:45:25+00:00 |
| Ended | 2026-10-23T03:57:55+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claims.ts, cli.ts, items.ts, policy.ts, pricing.ts, scenario.ts
- **Implementation LOC** (total): 303
- **Test files**: claims.spec.ts, cli.spec.ts, pricing.spec.ts
- **Test LOC** (total): 428
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_03-45-24_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_03-45-24_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash

 ✓ src/cli.spec.ts  (8 tests) 6733ms
 ✓ src/pricing.spec.ts  (23 tests) 6ms
 ✓ src/claims.spec.ts  (14 tests) 7ms

 Test Files  3 passed (3)
      Tests  45 passed (45)
   Start at  03:57:56
   Duration  7.80s (transform 126ms, setup 0ms, collect 177ms, tests 6.75s, environment 1ms, prepare 311ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 67% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 91 | ×2 | 182 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 7 | ×5 | 35 |
| Assignments | 69 | ×6 | 414 |
| **Total Mass** | | | **760** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 260 |
| Functions | 21 |
| Longest Function | 25 lines |
| Avg LOC/Function | 6.76 |
| Median LOC/Function | 3.00 |
| Imports | 11 |

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
| McCabe (Cyclomatic) | 5 | 1.75 | 0 |
| Cognitive (SonarJS) | 7 | 2.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8807703 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 70 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 90 |
| Predictions Total | 90 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 45 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


