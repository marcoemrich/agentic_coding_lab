# Analysis Report: 2026-09-03_23-16-50_claim-office-example-mapping_v11-superpowers-tdd_opus-5-no-thinking

Generated: 2026-09-03T23:58:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v11-superpowers-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 631s |
| Started | 2026-09-03T23:16:50+00:00 |
| Ended | 2026-09-03T23:27:26+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 273
- **Test files**: claim.spec.ts, cli.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 452
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-03_23-16-50_claim-office-example-mapping_v11-superpowers-tdd_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-03_23-16-50_claim-office-example-mapping_v11-superpowers-tdd_opus-5-no-thinking

 ✓ src/quote.spec.ts  (22 tests) 7ms
 ✓ src/claim.spec.ts  (17 tests) 7ms
 ✓ src/scenario.spec.ts  (3 tests) 4ms
 ✓ src/cli.spec.ts  (4 tests) 2512ms

 Test Files  4 passed (4)
      Tests  46 passed (46)
   Start at  23:58:37
   Duration  2.95s (transform 233ms, setup 0ms, collect 303ms, tests 2.53s, environment 5ms, prepare 492ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 71 | ×2 | 142 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 7 | ×5 | 35 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **652** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 222 |
| Functions | 13 |
| Longest Function | 24 lines |
| Avg LOC/Function | 9.23 |
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
| McCabe (Cyclomatic) | 6 | 2.00 | 0 |
| Cognitive (SonarJS) | 7 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13993515 |
| Context Utilization | 53% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 16 |
| Avg Cycle Time | 10.72s |
| Avg Red Phase | 4.72s |
| Avg Green Phase | 4.47s |
| Avg Refactor Phase | 1.53s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | N/A |
| Predictions Total | N/A |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


