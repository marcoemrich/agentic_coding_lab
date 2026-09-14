# Analysis Report: 2026-09-14_20-55-51_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-2

Generated: 2026-09-14T21:01:33+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 339s |
| Started | 2026-09-14T20:55:51+00:00 |
| Ended | 2026-09-14T21:01:33+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claim.ts, cli.ts, policy.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 359
- **Test files**: claim.spec.ts, cli.spec.ts, policy.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 351
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_20-55-51_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_20-55-51_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-2

 ✓ src/premium.spec.ts  (24 tests) 5ms
 ✓ src/policy.spec.ts  (8 tests) 5ms
 ✓ src/scenario.spec.ts  (5 tests) 6ms
 ✓ src/cli.spec.ts  (4 tests) 2129ms
 ✓ src/claim.spec.ts  (11 tests) 4ms

 Test Files  5 passed (5)
      Tests  52 passed (52)
   Start at  21:01:34
   Duration  3.37s (transform 123ms, setup 0ms, collect 170ms, tests 2.15s, environment 1ms, prepare 388ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 83 | ×1 | 83 |
| Invocations | 104 | ×2 | 208 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 11 | ×5 | 55 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **792** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 291 |
| Functions | 17 |
| Longest Function | 28 lines |
| Avg LOC/Function | 7.41 |
| Median LOC/Function | 5.00 |
| Imports | 9 |

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
| McCabe (Cyclomatic) | 6 | 2.04 | 0 |
| Cognitive (SonarJS) | 7 | 3.09 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2268398 |
| Context Utilization | 35% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
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


