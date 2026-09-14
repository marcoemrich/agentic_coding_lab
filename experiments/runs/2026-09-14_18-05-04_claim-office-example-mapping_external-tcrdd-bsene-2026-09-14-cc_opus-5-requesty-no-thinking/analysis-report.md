# Analysis Report: 2026-09-14_18-05-04_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-cc_opus-5-requesty-no-thinking

Generated: 2026-09-14T18:20:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-bsene-2026-09-14-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 923s |
| Started | 2026-09-14T18:05:04+00:00 |
| Ended | 2026-09-14T18:20:30+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, policy.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 264
- **Test files**: claim.spec.ts, cli.spec.ts, examples.spec.ts, policy.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 347
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_18-05-04_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-cc_opus-5-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_18-05-04_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-cc_opus-5-requesty-no-thinking

 ✓ src/examples.spec.ts  (17 tests) 8ms
 ✓ src/claim.spec.ts  (8 tests) 5ms
 ✓ src/cli.spec.ts  (3 tests) 1153ms
 ✓ src/quote.spec.ts  (11 tests) 7ms
 ✓ src/scenario.spec.ts  (2 tests) 5ms
 ✓ src/policy.spec.ts  (1 test) 2ms

 Test Files  6 passed (6)
      Tests  42 passed (42)
   Start at  18:20:31
   Duration  3.00s (transform 175ms, setup 0ms, collect 176ms, tests 1.18s, environment 1ms, prepare 589ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 8 | ×5 | 40 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **645** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 219 |
| Functions | 11 |
| Longest Function | 19 lines |
| Avg LOC/Function | 8.18 |
| Median LOC/Function | 7.00 |
| Imports | 4 |

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
| McCabe (Cyclomatic) | 5 | 2.28 | 0 |
| Cognitive (SonarJS) | 5 | 2.18 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 20693544 |
| Context Utilization | 57% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 29 |
| Avg Cycle Time | 10.31s |
| Avg Red Phase | 3.44s |
| Avg Green Phase | 3.8s |
| Avg Refactor Phase | 3.07s |

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
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


