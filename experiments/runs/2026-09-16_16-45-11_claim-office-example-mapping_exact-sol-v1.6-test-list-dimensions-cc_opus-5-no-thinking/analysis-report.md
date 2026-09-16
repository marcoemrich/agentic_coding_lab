# Analysis Report: 2026-09-16_16-45-11_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking

Generated: 2026-09-16T17:18:35+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6-test-list-dimensions-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1999s |
| Started | 2026-09-16T16:45:11+00:00 |
| Ended | 2026-09-16T17:18:35+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, customer-modifiers.ts, policy.ts, price-list.ts, quote.ts, reimbursement.ts, risk.ts, rounding.ts, scenario.ts
- **Implementation LOC** (total): 376
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 592
- **Active tests**: 73
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (73 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_16-45-11_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_16-45-11_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (73 tests) 5203ms

 Test Files  1 passed (1)
      Tests  73 passed (73)
   Start at  17:18:36
   Duration  5.54s (transform 109ms, setup 0ms, collect 124ms, tests 5.20s, environment 0ms, prepare 69ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 75% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 83 | ×1 | 83 |
| Invocations | 109 | ×2 | 218 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 10 | ×5 | 50 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **709** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 310 |
| Functions | 32 |
| Longest Function | 25 lines |
| Avg LOC/Function | 5.09 |
| Median LOC/Function | 3.00 |
| Imports | 17 |

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
| McCabe (Cyclomatic) | 3 | 1.43 | 0 |
| Cognitive (SonarJS) | 2 | 1.13 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 30756389 |
| Context Utilization | 90% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 51.92s |
| Avg Red Phase | 45.96s |
| Avg Green Phase | 3.05s |
| Avg Refactor Phase | 2.91s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 134 |
| Predictions Total | 136 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 68 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


