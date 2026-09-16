# Analysis Report: 2026-09-16_10-24-14_claim-office-example-mapping_exact-sol-v1.6.1-naming-refactor-trial-cc_opus-5-no-thinking

Generated: 2026-09-16T10:38:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6.1-naming-refactor-trial-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 849s |
| Started | 2026-09-16T10:24:14+00:00 |
| Ended | 2026-09-16T10:38:26+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts
- **Implementation LOC** (total): 295
- **Test files**: claimOffice.spec.ts
- **Test LOC** (total): 332
- **Active tests**: 54
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (54 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_10-24-14_claim-office-example-mapping_exact-sol-v1.6.1-naming-refactor-trial-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_10-24-14_claim-office-example-mapping_exact-sol-v1.6.1-naming-refactor-trial-cc_opus-5-no-thinking

 ✓ src/claimOffice.spec.ts  (54 tests) 3000ms

 Test Files  1 passed (1)
      Tests  54 passed (54)
   Start at  10:38:27
   Duration  3.29s (transform 77ms, setup 0ms, collect 80ms, tests 3.00s, environment 0ms, prepare 73ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 73% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 95 | ×2 | 190 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 10 | ×5 | 50 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **704** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 245 |
| Functions | 26 |
| Longest Function | 18 lines |
| Avg LOC/Function | 6.38 |
| Median LOC/Function | 7.00 |
| Imports | 3 |

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
| Cognitive (SonarJS) | 3 | 1.47 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11637622 |
| Context Utilization | 62% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 9.68s |
| Avg Red Phase | 7.34s |
| Avg Green Phase | 2.34s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 34 |
| Predictions Total | 36 |
| Accuracy | 94% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


