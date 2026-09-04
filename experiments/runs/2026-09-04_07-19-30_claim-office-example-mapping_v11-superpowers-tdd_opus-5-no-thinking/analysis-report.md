# Analysis Report: 2026-09-04_07-19-30_claim-office-example-mapping_v11-superpowers-tdd_opus-5-no-thinking

Generated: 2026-09-04T07:28:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v11-superpowers-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 553s |
| Started | 2026-09-04T07:19:30+00:00 |
| Ended | 2026-09-04T07:28:45+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, policy.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 293
- **Test files**: claim.spec.ts, cli.spec.ts, policy.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 454
- **Active tests**: 53
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (56 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_07-19-30_claim-office-example-mapping_v11-superpowers-tdd_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_07-19-30_claim-office-example-mapping_v11-superpowers-tdd_opus-5-no-thinking

 ✓ src/quote.spec.ts  (25 tests) 6ms
 ✓ src/claim.spec.ts  (16 tests) 5ms
 ✓ src/scenario.spec.ts  (6 tests) 5ms
 ✓ src/cli.spec.ts  (4 tests) 2100ms
 ✓ src/policy.spec.ts  (5 tests) 4ms

 Test Files  5 passed (5)
      Tests  56 passed (56)
   Start at  07:28:46
   Duration  3.31s (transform 100ms, setup 0ms, collect 144ms, tests 2.12s, environment 1ms, prepare 361ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 94 | ×2 | 188 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 12 | ×5 | 60 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **689** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 239 |
| Functions | 18 |
| Longest Function | 26 lines |
| Avg LOC/Function | 7.11 |
| Median LOC/Function | 4.50 |
| Imports | 6 |

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
| McCabe (Cyclomatic) | 6 | 2.22 | 0 |
| Cognitive (SonarJS) | 8 | 2.77 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10976830 |
| Context Utilization | 51% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 16.43s |
| Avg Red Phase | 4.57s |
| Avg Green Phase | 3.27s |
| Avg Refactor Phase | 8.59s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | N/A |
| Predictions Total | N/A |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


