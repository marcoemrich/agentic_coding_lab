# Analysis Report: 2026-09-14_18-44-59_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-cc_opus-5-requesty-no-thinking

Generated: 2026-09-14T19:00:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-bsene-2026-09-14-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 924s |
| Started | 2026-09-14T18:44:59+00:00 |
| Ended | 2026-09-14T19:00:26+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, policy.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 241
- **Test files**: claim.spec.ts, cli.spec.ts, package.spec.ts, policy.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 380
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_18-44-59_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-cc_opus-5-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_18-44-59_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-cc_opus-5-requesty-no-thinking

 ✓ src/claim.spec.ts  (11 tests) 6ms
 ✓ src/cli.spec.ts  (5 tests) 2664ms
 ✓ src/quote.spec.ts  (16 tests) 8ms
 ✓ src/scenario.spec.ts  (5 tests) 5ms
 ✓ src/policy.spec.ts  (4 tests) 3ms
 ✓ src/package.spec.ts  (1 test) 2ms

 Test Files  6 passed (6)
      Tests  42 passed (42)
   Start at  19:00:27
   Duration  4.32s (transform 123ms, setup 0ms, collect 180ms, tests 2.69s, environment 1ms, prepare 513ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 7 | ×5 | 35 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **604** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 205 |
| Functions | 11 |
| Longest Function | 26 lines |
| Avg LOC/Function | 9.73 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 5 | 1.95 | 0 |
| Cognitive (SonarJS) | 8 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 23806188 |
| Context Utilization | 61% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 9.97s |
| Avg Red Phase | 3.17s |
| Avg Green Phase | 3.4s |
| Avg Refactor Phase | 3.4s |

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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 10 |


