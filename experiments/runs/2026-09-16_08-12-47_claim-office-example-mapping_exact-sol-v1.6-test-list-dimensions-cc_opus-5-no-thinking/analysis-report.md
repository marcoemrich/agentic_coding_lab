# Analysis Report: 2026-09-16_08-12-47_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking

Generated: 2026-09-16T08:30:33+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6-test-list-dimensions-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1063s |
| Started | 2026-09-16T08:12:47+00:00 |
| Ended | 2026-09-16T08:30:33+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claim.ts, cli.ts, component-block.ts, customer-modifiers.ts, customer.ts, item-risk.ts, item.ts, policy.ts, price-list.ts, rational.ts, reimbursement.ts, scenario.ts
- **Implementation LOC** (total): 371
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 347
- **Active tests**: 54
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (54 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_08-12-47_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_08-12-47_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (51 tests) 10ms
 ✓ src/cli.spec.ts  (3 tests) 1458ms

 Test Files  2 passed (2)
      Tests  54 passed (54)
   Start at  08:30:34
   Duration  1.99s (transform 98ms, setup 0ms, collect 121ms, tests 1.47s, environment 0ms, prepare 154ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 87 | ×1 | 87 |
| Invocations | 125 | ×2 | 250 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 7 | ×5 | 35 |
| Assignments | 76 | ×6 | 456 |
| **Total Mass** | | | **896** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 299 |
| Functions | 31 |
| Longest Function | 15 lines |
| Avg LOC/Function | 5.06 |
| Median LOC/Function | 5.00 |
| Imports | 25 |

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
| McCabe (Cyclomatic) | 3 | 1.60 | 0 |
| Cognitive (SonarJS) | 2 | 1.22 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 18272872 |
| Context Utilization | 71% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 2.60s |
| Avg Red Phase | 2.6s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 93 |
| Predictions Total | 94 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 47 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


