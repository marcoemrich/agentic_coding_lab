# Analysis Report: 2026-09-23_05-50-16_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

Generated: 2026-09-23T05:53:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 206s |
| Started | 2026-09-23T05:50:17+00:00 |
| Ended | 2026-09-23T05:53:46+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, policy.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 272
- **Test files**: claim.spec.ts, cli.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 340
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_05-50-16_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_05-50-16_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

 ✓ src/quote.spec.ts  (26 tests) 5ms
 ✓ src/claim.spec.ts  (14 tests) 5ms
 ✓ src/cli.spec.ts  (4 tests) 406ms
 ✓ src/scenario.spec.ts  (3 tests) 4ms

 Test Files  4 passed (4)
      Tests  47 passed (47)
   Start at  05:53:47
   Duration  1.37s (transform 96ms, setup 0ms, collect 127ms, tests 420ms, environment 1ms, prepare 288ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 81 | ×2 | 162 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 9 | ×5 | 45 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **692** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 220 |
| Functions | 9 |
| Longest Function | 19 lines |
| Avg LOC/Function | 9.33 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 7 | 2.20 | 0 |
| Cognitive (SonarJS) | 8 | 2.90 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2391478 |
| Context Utilization | 31% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 18 |
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


