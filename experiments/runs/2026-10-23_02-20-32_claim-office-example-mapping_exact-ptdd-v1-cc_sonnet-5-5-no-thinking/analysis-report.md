# Analysis Report: 2026-10-23_02-20-32_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking

Generated: 2026-10-23T02:40:48+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | sonnet-5-5-no-thinking |
| Model Version(s) | claude-sonnet-5-5 |
| Thinking | unknown |
| Duration | 1205s |
| Started | 2026-10-23T02:20:32+00:00 |
| Ended | 2026-10-23T02:40:48+00:00 |

## Code Metrics

- **Implementation files**: base-premium.ts, claim.ts, cli.ts, coverage.ts, item-risk-surcharge.ts, item.ts, policy-modifiers.ts, premium.ts, price-list.ts, reimbursement.ts, scenario.ts
- **Implementation LOC** (total): 305
- **Test files**: base-premium.spec.ts, claim.spec.ts, cli.spec.ts, quote.spec.ts
- **Test LOC** (total): 462
- **Active tests**: 55
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (55 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_02-20-32_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_02-20-32_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking

 ✓ src/claim.spec.ts  (24 tests) 9ms
 ✓ src/quote.spec.ts  (16 tests) 6ms
 ✓ src/cli.spec.ts  (3 tests) 508ms
 ✓ src/base-premium.spec.ts  (12 tests) 4ms

 Test Files  4 passed (4)
      Tests  55 passed (55)
   Start at  02:40:49
   Duration  1.45s (transform 108ms, setup 0ms, collect 133ms, tests 527ms, environment 1ms, prepare 282ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 75 | ×1 | 75 |
| Invocations | 100 | ×2 | 200 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 12 | ×5 | 60 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **725** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 264 |
| Functions | 26 |
| Longest Function | 13 lines |
| Avg LOC/Function | 5.50 |
| Median LOC/Function | 5.00 |
| Imports | 20 |

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
| McCabe (Cyclomatic) | 4 | 1.78 | 0 |
| Cognitive (SonarJS) | 3 | 1.59 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 61298684 |
| Context Utilization | 112% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 57 |
| Avg Cycle Time | 7.10s |
| Avg Red Phase | 1.83s |
| Avg Green Phase | 3.12s |
| Avg Refactor Phase | 2.15s |

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
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 38 |


