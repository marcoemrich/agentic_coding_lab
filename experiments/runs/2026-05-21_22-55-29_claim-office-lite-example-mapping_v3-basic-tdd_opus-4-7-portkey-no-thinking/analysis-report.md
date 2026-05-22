# Analysis Report: 2026-05-21_22-55-29_claim-office-lite-example-mapping_v3-basic-tdd_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T22:58:29+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 178s |
| Started | 2026-05-21T22:55:29+00:00 |
| Ended | 2026-05-21T22:58:29+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, items.ts, quote.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 285
- **Test file**: claim.spec.ts
- **Test file LOC**: 127
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_22-55-29_claim-office-lite-example-mapping_v3-basic-tdd_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_22-55-29_claim-office-lite-example-mapping_v3-basic-tdd_opus-4-7-portkey-no-thinking

 ✓ src/quote.spec.ts  (19 tests) 5ms
 ✓ src/claim.spec.ts  (15 tests) 4ms
 ✓ src/scenario.spec.ts  (2 tests) 3ms

 Test Files  3 passed (3)
      Tests  36 passed (36)
   Start at  22:58:30
   Duration  495ms (transform 57ms, setup 0ms, collect 69ms, tests 12ms, environment 0ms, prepare 151ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 87 | ×1 | 87 |
| Invocations | 93 | ×2 | 186 |
| Conditionals | 25 | ×4 | 100 |
| Loops | 11 | ×5 | 55 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **800** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 227 |
| Functions | 10 |
| Longest Function | 66 lines |
| Avg LOC/Function | 18.00 |
| Median LOC/Function | 6.00 |
| Imports | 9 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 4.45 | 1 |
| Cognitive (SonarJS) | 21 | 5.40 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2430496 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 13.64s |
| Avg Red Phase | 5.06s |
| Avg Green Phase | 8.58s |
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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


