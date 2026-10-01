# Analysis Report: 2026-10-01_01-57-15_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-5

Generated: 2026-10-01T02:01:57+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 276s |
| Started | 2026-10-01T01:57:15+00:00 |
| Ended | 2026-10-01T02:01:57+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, policy.ts, premium.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 295
- **Test files**: claim.spec.ts, cli.spec.ts, policy.spec.ts, premium.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 539
- **Active tests**: 55
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (55 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-57-15_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-57-15_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-5

 ✓ src/claim.spec.ts  (15 tests) 6ms
 ✓ src/quote.spec.ts  (11 tests) 4ms
 ✓ src/cli.spec.ts  (5 tests) 534ms
 ✓ src/scenario.spec.ts  (4 tests) 4ms
 ✓ src/premium.spec.ts  (14 tests) 8ms
 ✓ src/policy.spec.ts  (6 tests) 5ms

 Test Files  6 passed (6)
      Tests  55 passed (55)
   Start at  02:01:59
   Duration  2.33s (transform 191ms, setup 0ms, collect 265ms, tests 561ms, environment 1ms, prepare 489ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 98 | ×2 | 196 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 11 | ×5 | 55 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **754** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 249 |
| Functions | 17 |
| Longest Function | 30 lines |
| Avg LOC/Function | 9.18 |
| Median LOC/Function | 7.00 |
| Imports | 8 |

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
| McCabe (Cyclomatic) | 5 | 2.26 | 0 |
| Cognitive (SonarJS) | 7 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2950543 |
| Context Utilization | 33% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 20 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


