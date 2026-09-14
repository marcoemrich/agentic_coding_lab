# Analysis Report: 2026-09-14_20-59-57_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

Generated: 2026-09-14T21:04:19+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 259s |
| Started | 2026-09-14T20:59:57+00:00 |
| Ended | 2026-09-14T21:04:19+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, pricing.ts, scenario.ts
- **Implementation LOC** (total): 321
- **Test files**: claim.spec.ts, premium.spec.ts, pricing.spec.ts, scenario.spec.ts
- **Test LOC** (total): 439
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_20-59-57_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_20-59-57_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

 ✓ src/claim.spec.ts  (16 tests) 6ms
 ✓ src/premium.spec.ts  (13 tests) 5ms
 ✓ src/scenario.spec.ts  (5 tests) 4ms
 ✓ src/pricing.spec.ts  (6 tests) 4ms

 Test Files  4 passed (4)
      Tests  40 passed (40)
   Start at  21:04:20
   Duration  906ms (transform 79ms, setup 0ms, collect 105ms, tests 19ms, environment 1ms, prepare 286ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 81 | ×2 | 162 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 12 | ×5 | 60 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **680** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 266 |
| Functions | 14 |
| Longest Function | 22 lines |
| Avg LOC/Function | 8.00 |
| Median LOC/Function | 5.00 |
| Imports | 6 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 1.91 | 0 |
| Cognitive (SonarJS) | 8 | 2.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3044836 |
| Context Utilization | 33% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 14.72s |
| Avg Red Phase | 9.55s |
| Avg Green Phase | 5.17s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


