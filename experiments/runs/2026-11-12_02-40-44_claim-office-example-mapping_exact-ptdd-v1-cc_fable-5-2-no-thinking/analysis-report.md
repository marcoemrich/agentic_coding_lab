# Analysis Report: 2026-11-12_02-40-44_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking

Generated: 2026-11-12T03:19:50+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | fable-5-2-no-thinking |
| Model Version(s) | claude-fable-5-2 |
| Thinking | unknown |
| Duration | 2343s |
| Started | 2026-11-12T02:40:44+00:00 |
| Ended | 2026-11-12T03:19:50+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, customer-contracts.ts, percent.ts, policy.ts, price-list.ts, quote.ts, rounding.ts, scenario.ts
- **Implementation LOC** (total): 313
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 372
- **Active tests**: 70
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (70 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-11-12_02-40-44_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-11-12_02-40-44_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking

 ✓ src/claim-office.spec.ts  (70 tests) 749ms

 Test Files  1 passed (1)
      Tests  70 passed (70)
   Start at  03:19:51
   Duration  1.04s (transform 88ms, setup 0ms, collect 90ms, tests 749ms, environment 0ms, prepare 64ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 119 | ×2 | 238 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 9 | ×5 | 45 |
| Assignments | 39 | ×6 | 234 |
| **Total Mass** | | | **641** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 256 |
| Functions | 30 |
| Longest Function | 10 lines |
| Avg LOC/Function | 4.47 |
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
| McCabe (Cyclomatic) | 3 | 1.44 | 0 |
| Cognitive (SonarJS) | 3 | 1.54 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 71097997 |
| Context Utilization | 136% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 15.43s |
| Avg Red Phase | 10.48s |
| Avg Green Phase | 0.94s |
| Avg Refactor Phase | 4.01s |

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
| Refactorings Applied | 30 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


