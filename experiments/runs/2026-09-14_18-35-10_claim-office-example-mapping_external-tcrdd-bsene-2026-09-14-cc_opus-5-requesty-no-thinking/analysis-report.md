# Analysis Report: 2026-09-14_18-35-10_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-cc_opus-5-requesty-no-thinking

Generated: 2026-09-14T18:49:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-bsene-2026-09-14-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 886s |
| Started | 2026-09-14T18:35:10+00:00 |
| Ended | 2026-09-14T18:49:59+00:00 |

## Code Metrics

- **Implementation files**: catalogue.ts, claim.ts, cli.ts, policy.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 234
- **Test files**: claim.spec.ts, cli.spec.ts, policy.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 226
- **Active tests**: 25
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (25 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_18-35-10_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-cc_opus-5-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_18-35-10_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-cc_opus-5-requesty-no-thinking

 ✓ src/claim.spec.ts  (7 tests) 5ms
 ✓ src/quote.spec.ts  (11 tests) 4ms
 ✓ src/cli.spec.ts  (3 tests) 2524ms
 ✓ src/scenario.spec.ts  (2 tests) 3ms
 ✓ src/policy.spec.ts  (2 tests) 3ms

 Test Files  5 passed (5)
      Tests  25 passed (25)
   Start at  18:50:00
   Duration  3.76s (transform 117ms, setup 0ms, collect 164ms, tests 2.54s, environment 1ms, prepare 381ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 67 | ×2 | 134 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 6 | ×5 | 30 |
| Assignments | 67 | ×6 | 402 |
| **Total Mass** | | | **688** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 198 |
| Functions | 11 |
| Longest Function | 20 lines |
| Avg LOC/Function | 8.27 |
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
| McCabe (Cyclomatic) | 6 | 2.18 | 0 |
| Cognitive (SonarJS) | 5 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 21144031 |
| Context Utilization | 58% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 29 |
| Avg Cycle Time | 11.13s |
| Avg Red Phase | 4.26s |
| Avg Green Phase | 3.73s |
| Avg Refactor Phase | 3.14s |

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
| Tests Passed Immediately | 5 |


