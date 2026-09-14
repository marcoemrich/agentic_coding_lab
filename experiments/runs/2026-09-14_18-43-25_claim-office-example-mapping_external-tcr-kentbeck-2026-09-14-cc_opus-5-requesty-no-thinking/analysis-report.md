# Analysis Report: 2026-09-14_18-43-25_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-cc_opus-5-requesty-no-thinking

Generated: 2026-09-14T18:47:33+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcr-kentbeck-2026-09-14-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 244s |
| Started | 2026-09-14T18:43:25+00:00 |
| Ended | 2026-09-14T18:47:33+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, pricelist.ts, scenario.ts
- **Implementation LOC** (total): 229
- **Test files**: claim.spec.ts, cli.spec.ts, examples.spec.ts, premium.spec.ts, pricelist.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 401
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_18-43-25_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-cc_opus-5-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_18-43-25_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-cc_opus-5-requesty-no-thinking

 ✓ src/claim.spec.ts  (11 tests) 6ms
 ✓ src/cli.spec.ts  (4 tests) 662ms
 ✓ src/examples.spec.ts  (3 tests) 3ms
 ✓ src/quote.spec.ts  (7 tests) 3ms
 ✓ src/scenario.spec.ts  (4 tests) 4ms
 ✓ src/premium.spec.ts  (7 tests) 4ms
 ✓ src/pricelist.spec.ts  (3 tests) 5ms

 Test Files  7 passed (7)
      Tests  39 passed (39)
   Start at  18:47:34
   Duration  2.32s (transform 111ms, setup 0ms, collect 177ms, tests 687ms, environment 1ms, prepare 531ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 81 | ×2 | 162 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 10 | ×5 | 50 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **665** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 194 |
| Functions | 15 |
| Longest Function | 20 lines |
| Avg LOC/Function | 7.47 |
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
| McCabe (Cyclomatic) | 6 | 2.10 | 0 |
| Cognitive (SonarJS) | 8 | 2.89 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2897067 |
| Context Utilization | 30% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 2.80s |
| Avg Red Phase | 2s |
| Avg Green Phase | 0.8s |
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
| Tests Passed Immediately | 1 |


