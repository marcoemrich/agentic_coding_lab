# Analysis Report: 2026-09-14_17-58-27_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-cc_opus-5-requesty-no-thinking

Generated: 2026-09-14T18:04:33+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcr-kentbeck-2026-09-14-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 363s |
| Started | 2026-09-14T17:58:27+00:00 |
| Ended | 2026-09-14T18:04:33+00:00 |

## Code Metrics

- **Implementation files**: app.ts, catalog.ts, claim.ts, cli.ts, policy.ts, premium.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 278
- **Test files**: app.spec.ts, catalog.spec.ts, claim.spec.ts, cli.spec.ts, policy.spec.ts, premium.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 515
- **Active tests**: 59
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (59 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_17-58-27_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-cc_opus-5-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_17-58-27_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-cc_opus-5-requesty-no-thinking

 ✓ src/scenario.spec.ts  (6 tests) 5ms
 ✓ src/cli.spec.ts  (5 tests) 1142ms
 ✓ src/quote.spec.ts  (11 tests) 4ms
 ✓ src/policy.spec.ts  (9 tests) 5ms
 ✓ src/premium.spec.ts  (14 tests) 5ms
 ✓ src/app.spec.ts  (4 tests) 5ms
 ✓ src/claim.spec.ts  (7 tests) 3ms
 ✓ src/catalog.spec.ts  (3 tests) 3ms

 Test Files  8 passed (8)
      Tests  59 passed (59)
   Start at  18:04:34
   Duration  3.22s (transform 195ms, setup 2ms, collect 264ms, tests 1.17s, environment 1ms, prepare 652ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 96 | ×2 | 192 |
| Conditionals | 24 | ×4 | 96 |
| Loops | 8 | ×5 | 40 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **769** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 241 |
| Functions | 11 |
| Longest Function | 23 lines |
| Avg LOC/Function | 12.09 |
| Median LOC/Function | 11.00 |
| Imports | 12 |

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
| McCabe (Cyclomatic) | 7 | 3.40 | 0 |
| Cognitive (SonarJS) | 10 | 3.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5540998 |
| Context Utilization | 36% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 5.79s |
| Avg Red Phase | 4.04s |
| Avg Green Phase | 1.75s |
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
| Tests Passed Immediately | 4 |


