# Analysis Report: 2026-05-21_22-55-29_claim-office-lite-example-mapping_v3-basic-tdd_opus-4-7-portkey-no-thinking-2

Generated: 2026-05-21T22:58:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 191s |
| Started | 2026-05-21T22:55:29+00:00 |
| Ended | 2026-05-21T22:58:42+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, pricing.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 276
- **Test file**: pricing.spec.ts
- **Test file LOC**: 95
- **Active tests**: 21
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_22-55-29_claim-office-lite-example-mapping_v3-basic-tdd_opus-4-7-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_22-55-29_claim-office-lite-example-mapping_v3-basic-tdd_opus-4-7-portkey-no-thinking-2

 ✓ src/quote.spec.ts  (8 tests) 2ms
 ✓ src/scenario.spec.ts  (9 tests) 4ms
 ✓ src/claim.spec.ts  (12 tests) 3ms
 ✓ src/pricing.spec.ts  (21 tests) 4ms

 Test Files  4 passed (4)
      Tests  50 passed (50)
   Start at  22:58:43
   Duration  633ms (transform 50ms, setup 0ms, collect 73ms, tests 13ms, environment 1ms, prepare 201ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 98 | ×2 | 196 |
| Conditionals | 24 | ×4 | 96 |
| Loops | 10 | ×5 | 50 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **782** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 224 |
| Functions | 11 |
| Longest Function | 45 lines |
| Avg LOC/Function | 15.64 |
| Median LOC/Function | 7.00 |
| Imports | 6 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 5 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 4.27 | 1 |
| Cognitive (SonarJS) | 15 | 6.11 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2928516 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 16.89s |
| Avg Red Phase | 0s |
| Avg Green Phase | 2.1s |
| Avg Refactor Phase | 14.79s |

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
| Tests Passed Immediately | 0 |


