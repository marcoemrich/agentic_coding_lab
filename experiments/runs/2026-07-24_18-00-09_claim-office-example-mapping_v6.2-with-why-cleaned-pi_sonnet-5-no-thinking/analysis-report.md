# Analysis Report: 2026-07-24_18-00-09_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5-no-thinking

Generated: 2026-07-24T19:40:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | sonnet-5-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 6036s |
| Started | 2026-07-24T18:00:09+00:00 |
| Ended | 2026-07-24T19:40:47+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, collections.ts, items.ts, pricing.ts, scenario.ts
- **Implementation LOC** (total): 315
- **Test file**: claims.spec.ts
- **Test file LOC**: 115
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_18-00-09_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_18-00-09_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5-no-thinking

 ✓ src/claims.spec.ts  (16 tests) 4ms
 ✓ src/scenario.spec.ts  (7 tests) 3ms
 ✓ src/pricing.spec.ts  (9 tests) 3ms
 ✓ src/items.spec.ts  (9 tests) 3ms

 Test Files  4 passed (4)
      Tests  41 passed (41)
   Start at  19:40:49
   Duration  587ms (transform 52ms, setup 0ms, collect 72ms, tests 13ms, environment 0ms, prepare 186ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 77 | ×2 | 154 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 11 | ×5 | 55 |
| Assignments | 90 | ×6 | 540 |
| **Total Mass** | | | **868** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 260 |
| Functions | 20 |
| Longest Function | 16 lines |
| Avg LOC/Function | 5.70 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 4 | 1.69 | 0 |
| Cognitive (SonarJS) | 4 | 1.85 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3689720 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 62 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 40 |
| Predictions Total | 40 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


