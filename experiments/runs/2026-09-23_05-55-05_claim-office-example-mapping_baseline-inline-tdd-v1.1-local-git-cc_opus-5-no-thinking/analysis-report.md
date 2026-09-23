# Analysis Report: 2026-09-23_05-55-05_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

Generated: 2026-09-23T05:58:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 227s |
| Started | 2026-09-23T05:55:05+00:00 |
| Ended | 2026-09-23T05:58:55+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claim.ts, cli.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 285
- **Test files**: claim.spec.ts, cli.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 389
- **Active tests**: 48
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_05-55-05_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_05-55-05_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

 ✓ src/claim.spec.ts  (17 tests) 7ms
 ✓ src/quote.spec.ts  (21 tests) 6ms
 ✓ src/cli.spec.ts  (5 tests) 2587ms
 ✓ src/scenario.spec.ts  (5 tests) 4ms

 Test Files  4 passed (4)
      Tests  48 passed (48)
   Start at  05:58:56
   Duration  3.54s (transform 96ms, setup 2ms, collect 129ms, tests 2.60s, environment 1ms, prepare 296ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 12 | ×5 | 60 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **685** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 227 |
| Functions | 15 |
| Longest Function | 21 lines |
| Avg LOC/Function | 8.93 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 5 | 1.80 | 0 |
| Cognitive (SonarJS) | 5 | 2.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1880616 |
| Context Utilization | 31% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
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


