# Analysis Report: 2026-09-23_05-59-59_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-23T06:11:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 679s |
| Started | 2026-09-23T05:59:59+00:00 |
| Ended | 2026-09-23T06:11:21+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, customer-modifiers.ts, damage-matching.ts, item-pricing.ts, item.ts, mhpco-rounding.ts, policy-register.ts, policy.ts, price-list.ts, quote.ts, reimbursement.ts, risk-surcharges.ts, scenario.ts
- **Implementation LOC** (total): 354
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 386
- **Active tests**: 55
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (55 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_05-59-59_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_05-59-59_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (55 tests) 1903ms

 Test Files  1 passed (1)
      Tests  55 passed (55)
   Start at  06:11:23
   Duration  2.22s (transform 92ms, setup 0ms, collect 99ms, tests 1.90s, environment 0ms, prepare 71ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 74% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 77 | ×1 | 77 |
| Invocations | 114 | ×2 | 228 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 9 | ×5 | 45 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **730** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 301 |
| Functions | 29 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.03 |
| Median LOC/Function | 4.00 |
| Imports | 24 |

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
| McCabe (Cyclomatic) | 3 | 1.38 | 0 |
| Cognitive (SonarJS) | 2 | 1.15 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8566267 |
| Context Utilization | 55% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 15 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 29 |
| Predictions Total | 29 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


