# Analysis Report: 2026-11-12_01-56-34_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking-2

Generated: 2026-11-12T02:40:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | fable-5-2-no-thinking |
| Model Version(s) | claude-fable-5-2 |
| Thinking | unknown |
| Duration | 2623s |
| Started | 2026-11-12T01:56:34+00:00 |
| Ended | 2026-11-12T02:40:21+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claim.ts, cli.ts, percent.ts, premium.ts, price-list.ts, rounding.ts
- **Implementation LOC** (total): 249
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 432
- **Active tests**: 56
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (56 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-11-12_01-56-34_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-11-12_01-56-34_claim-office-example-mapping_exact-ptdd-v1-cc_fable-5-2-no-thinking-2

 ✓ src/claim-office.spec.ts  (53 tests) 12ms
 ✓ src/cli.spec.ts  (3 tests) 306ms

 Test Files  2 passed (2)
      Tests  56 passed (56)
   Start at  02:40:22
   Duration  841ms (transform 98ms, setup 0ms, collect 106ms, tests 318ms, environment 0ms, prepare 151ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 7 | ×5 | 35 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **613** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 207 |
| Functions | 24 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.92 |
| Median LOC/Function | 4.00 |
| Imports | 11 |

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
| McCabe (Cyclomatic) | 3 | 1.39 | 0 |
| Cognitive (SonarJS) | 2 | 1.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 105872152 |
| Context Utilization | 158% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 26.84s |
| Avg Red Phase | 15.14s |
| Avg Green Phase | 11.7s |
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


