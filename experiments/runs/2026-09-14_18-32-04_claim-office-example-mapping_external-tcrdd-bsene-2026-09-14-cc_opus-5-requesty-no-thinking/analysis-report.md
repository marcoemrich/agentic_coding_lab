# Analysis Report: 2026-09-14_18-32-04_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-cc_opus-5-requesty-no-thinking

Generated: 2026-09-14T18:43:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-bsene-2026-09-14-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 676s |
| Started | 2026-09-14T18:32:04+00:00 |
| Ended | 2026-09-14T18:43:23+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, policy.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 244
- **Test files**: cli.spec.ts, policy.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 274
- **Active tests**: 32
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (32 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_18-32-04_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-cc_opus-5-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_18-32-04_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-cc_opus-5-requesty-no-thinking

 ✓ src/policy.spec.ts  (12 tests) 7ms
 ✓ src/quote.spec.ts  (14 tests) 5ms
 ✓ src/cli.spec.ts  (3 tests) 1942ms
 ✓ src/scenario.spec.ts  (3 tests) 10ms

 Test Files  4 passed (4)
      Tests  32 passed (32)
   Start at  18:43:24
   Duration  3.11s (transform 79ms, setup 0ms, collect 122ms, tests 1.96s, environment 1ms, prepare 415ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 8 | ×5 | 40 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **645** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 207 |
| Functions | 11 |
| Longest Function | 19 lines |
| Avg LOC/Function | 8.82 |
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
| McCabe (Cyclomatic) | 6 | 2.05 | 0 |
| Cognitive (SonarJS) | 7 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15199937 |
| Context Utilization | 52% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 30 |
| Avg Cycle Time | 9.19s |
| Avg Red Phase | 3.91s |
| Avg Green Phase | 3.32s |
| Avg Refactor Phase | 1.96s |

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
| Tests Passed Immediately | 8 |


