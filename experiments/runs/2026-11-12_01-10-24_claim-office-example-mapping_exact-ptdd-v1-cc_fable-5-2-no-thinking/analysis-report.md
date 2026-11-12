# Analysis Report: 2026-11-12_01-10-24_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking

Generated: 2026-11-12T01:55:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | fable-5-2-no-thinking |
| Model Version(s) | claude-fable-5-2 |
| Thinking | unknown |
| Duration | 2675s |
| Started | 2026-11-12T01:10:24+00:00 |
| Ended | 2026-11-12T01:55:02+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, command.ts, customer-account.ts, item.ts, percent.ts, policy.ts, premium.ts, price-list.ts, reimbursement.ts, rounding.ts
- **Implementation LOC** (total): 282
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 409
- **Active tests**: 59
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (59 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-11-12_01-10-24_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-11-12_01-10-24_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking

 ✓ src/claim-office.spec.ts  (50 tests) 10ms
 ✓ src/cli.spec.ts  (9 tests) 311ms

 Test Files  2 passed (2)
      Tests  59 passed (59)
   Start at  01:55:03
   Duration  866ms (transform 117ms, setup 0ms, collect 131ms, tests 321ms, environment 0ms, prepare 146ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 97% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 75 | ×1 | 75 |
| Invocations | 101 | ×2 | 202 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 10 | ×5 | 50 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **681** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 225 |
| Functions | 25 |
| Longest Function | 8 lines |
| Avg LOC/Function | 3.92 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.39 | 0 |
| Cognitive (SonarJS) | 2 | 1.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 119842679 |
| Context Utilization | 154% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 65 |
| Avg Cycle Time | 12.53s |
| Avg Red Phase | 5.19s |
| Avg Green Phase | 3.64s |
| Avg Refactor Phase | 3.7s |

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
| Refactorings Applied | 33 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 28 |


