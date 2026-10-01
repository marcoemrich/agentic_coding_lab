# Analysis Report: 2026-10-01_01-57-15_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-2

Generated: 2026-10-01T02:03:11+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 350s |
| Started | 2026-10-01T01:57:15+00:00 |
| Ended | 2026-10-01T02:03:11+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, items.ts, policy.ts, premium.ts, quote.ts, rounding.ts, scenario.ts
- **Implementation LOC** (total): 267
- **Test files**: claim.spec.ts, cli.spec.ts, items.spec.ts, policy.spec.ts, premium.spec.ts, quote.spec.ts, rounding.spec.ts, scenario.spec.ts
- **Test LOC** (total): 505
- **Active tests**: 65
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (65 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-57-15_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-57-15_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-2

 ✓ src/scenario.spec.ts  (12 tests) 6ms
 ✓ src/quote.spec.ts  (14 tests) 4ms
 ✓ src/cli.spec.ts  (4 tests) 1985ms
 ✓ src/premium.spec.ts  (9 tests) 4ms
 ✓ src/claim.spec.ts  (8 tests) 4ms
 ✓ src/policy.spec.ts  (7 tests) 3ms
 ✓ src/items.spec.ts  (7 tests) 3ms
 ✓ src/rounding.spec.ts  (4 tests) 2ms

 Test Files  8 passed (8)
      Tests  65 passed (65)
   Start at  02:03:12
   Duration  3.97s (transform 177ms, setup 0ms, collect 242ms, tests 2.01s, environment 1ms, prepare 619ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 85 | ×2 | 170 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 12 | ×5 | 60 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **679** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 214 |
| Functions | 15 |
| Longest Function | 27 lines |
| Avg LOC/Function | 8.73 |
| Median LOC/Function | 7.00 |
| Imports | 13 |

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
| McCabe (Cyclomatic) | 7 | 2.13 | 0 |
| Cognitive (SonarJS) | 8 | 2.82 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3360528 |
| Context Utilization | 36% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 26 |
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


