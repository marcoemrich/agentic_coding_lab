# Analysis Report: 2026-09-23_06-48-28_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

Generated: 2026-09-23T07:04:29+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 957s |
| Started | 2026-09-23T06:48:28+00:00 |
| Ended | 2026-09-23T07:04:29+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, claimOffice.ts, cli.ts, customer.ts, item.ts, premium.ts, priceList.ts
- **Implementation LOC** (total): 241
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 257
- **Active tests**: 47
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_06-48-28_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_06-48-28_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (44 tests) 10ms
 ✓ src/cli.spec.ts  (3 tests) 538ms

 Test Files  2 passed (2)
      Tests  47 passed (47)
   Start at  07:04:30
   Duration  1.08s (transform 80ms, setup 0ms, collect 108ms, tests 548ms, environment 0ms, prepare 144ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 86 | ×2 | 172 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 7 | ×5 | 35 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **612** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 201 |
| Functions | 24 |
| Longest Function | 14 lines |
| Avg LOC/Function | 4.71 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.41 | 0 |
| Cognitive (SonarJS) | 2 | 1.27 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 27059165 |
| Context Utilization | 72% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 100 |
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


