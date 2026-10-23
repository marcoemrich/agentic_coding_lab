# Analysis Report: 2026-10-23_02-45-45_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking

Generated: 2026-10-23T03:11:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | sonnet-5-5-no-thinking |
| Model Version(s) | claude-sonnet-5-5 |
| Thinking | unknown |
| Duration | 1533s |
| Started | 2026-10-23T02:45:45+00:00 |
| Ended | 2026-10-23T03:11:21+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claim-office-error.ts, cli.ts, damaged-items.ts, policy-register.ts, policy.ts, premium.ts, reimbursement.ts, rounding.ts, scenario.ts
- **Implementation LOC** (total): 340
- **Test files**: claim.spec.ts, cli.spec.ts, policy.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 516
- **Active tests**: 68
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (68 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_02-45-45_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_02-45-45_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking

 ✓ src/claim.spec.ts  (19 tests) 5ms
 ✓ src/premium.spec.ts  (29 tests) 6ms
 ✓ src/scenario.spec.ts  (5 tests) 5ms
 ✓ src/cli.spec.ts  (5 tests) 811ms
 ✓ src/policy.spec.ts  (10 tests) 5ms

 Test Files  5 passed (5)
      Tests  68 passed (68)
   Start at  03:11:22
   Duration  1.94s (transform 124ms, setup 0ms, collect 176ms, tests 832ms, environment 1ms, prepare 335ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 71 | ×1 | 71 |
| Invocations | 113 | ×2 | 226 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 7 | ×5 | 35 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **700** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 286 |
| Functions | 27 |
| Longest Function | 13 lines |
| Avg LOC/Function | 5.07 |
| Median LOC/Function | 4.00 |
| Imports | 22 |

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
| McCabe (Cyclomatic) | 4 | 1.48 | 0 |
| Cognitive (SonarJS) | 2 | 1.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 60693517 |
| Context Utilization | 114% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 16.82s |
| Avg Red Phase | 9.42s |
| Avg Green Phase | 6.28s |
| Avg Refactor Phase | 1.12s |

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
| Refactorings Applied | 50 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


