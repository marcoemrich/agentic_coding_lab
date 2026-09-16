# Analysis Report: 2026-09-16_16-42-42_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking

Generated: 2026-09-16T17:05:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6-test-list-dimensions-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1335s |
| Started | 2026-09-16T16:42:42+00:00 |
| Ended | 2026-09-16T17:05:01+00:00 |

## Code Metrics

- **Implementation files**: catalogue.ts, claim.ts, cli.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 291
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 308
- **Active tests**: 57
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (57 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_16-42-42_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_16-42-42_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (57 tests) 2032ms

 Test Files  1 passed (1)
      Tests  57 passed (57)
   Start at  17:05:03
   Duration  3.05s (transform 256ms, setup 0ms, collect 243ms, tests 2.03s, environment 0ms, prepare 239ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 85 | ×2 | 170 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 8 | ×5 | 40 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **695** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 234 |
| Functions | 21 |
| Longest Function | 20 lines |
| Avg LOC/Function | 5.81 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.67 | 0 |
| Cognitive (SonarJS) | 3 | 1.58 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 34449879 |
| Context Utilization | 86% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 57 |
| Avg Cycle Time | 10.19s |
| Avg Red Phase | 2.61s |
| Avg Green Phase | 3.83s |
| Avg Refactor Phase | 3.75s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 112 |
| Predictions Total | 112 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 56 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 33 |


