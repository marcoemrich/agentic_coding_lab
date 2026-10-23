# Analysis Report: 2026-10-23_02-20-31_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking-2

Generated: 2026-10-23T02:36:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | sonnet-5-5-no-thinking |
| Model Version(s) | claude-sonnet-5-5 |
| Thinking | unknown |
| Duration | 948s |
| Started | 2026-10-23T02:20:32+00:00 |
| Ended | 2026-10-23T02:36:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claim.ts, cli.ts, node-api.d.ts, price-list.ts, quote.ts
- **Implementation LOC** (total): 228
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 327
- **Active tests**: 59
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (59 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_02-20-31_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_02-20-31_claim-office-example-mapping_exact-ptdd-v1-cc_sonnet-5-5-no-thinking-2

 ✓ src/claim-office.spec.ts  (55 tests) 10ms
 ✓ src/cli.spec.ts  (4 tests) 700ms

 Test Files  2 passed (2)
      Tests  59 passed (59)
   Start at  02:36:31
   Duration  1.24s (transform 86ms, setup 0ms, collect 98ms, tests 710ms, environment 0ms, prepare 160ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 97% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 64 | ×2 | 128 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 10 | ×5 | 50 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **662** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 188 |
| Functions | 25 |
| Longest Function | 11 lines |
| Avg LOC/Function | 4.04 |
| Median LOC/Function | 2.00 |
| Imports | 7 |

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
| McCabe (Cyclomatic) | 3 | 1.37 | 0 |
| Cognitive (SonarJS) | 2 | 1.18 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 31638253 |
| Context Utilization | 87% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 8.51s |
| Avg Red Phase | 7.79s |
| Avg Green Phase | 0.72s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 12 |
| Predictions Total | 12 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


