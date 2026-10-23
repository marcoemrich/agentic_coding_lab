# Analysis Report: 2026-10-19_06-18-28_claim-office-example-mapping_exact-hybrid-v4.2-phase-continuation-pi_minimax-m3-no-thinking

Generated: 2026-10-19T07:13:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v4.2-phase-continuation-pi |
| Model | minimax-m3-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 3316s |
| Started | 2026-10-19T06:18:29+00:00 |
| Ended | 2026-10-19T07:13:50+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote-tables.ts, quote.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 377
- **Test files**: claim.spec.ts, cli.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 809
- **Active tests**: 54
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (54 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_06-18-28_claim-office-example-mapping_exact-hybrid-v4.2-phase-continuation-pi_minimax-m3-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_06-18-28_claim-office-example-mapping_exact-hybrid-v4.2-phase-continuation-pi_minimax-m3-no-thinking

 ✓ src/quote.spec.ts  (26 tests) 7ms
 ✓ src/scenario.spec.ts  (13 tests) 6ms
 ✓ src/claim.spec.ts  (10 tests) 4ms
 ✓ src/cli.spec.ts  (5 tests) 15ms

 Test Files  4 passed (4)
      Tests  54 passed (54)
   Start at  07:13:51
   Duration  788ms (transform 102ms, setup 1ms, collect 112ms, tests 32ms, environment 1ms, prepare 236ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 80 | ×1 | 80 |
| Invocations | 102 | ×2 | 204 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 14 | ×5 | 70 |
| Assignments | 65 | ×6 | 390 |
| **Total Mass** | | | **816** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 325 |
| Functions | 18 |
| Longest Function | 33 lines |
| Avg LOC/Function | 8.89 |
| Median LOC/Function | 7.00 |
| Imports | 9 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.42 | 0 |
| Cognitive (SonarJS) | 7 | 2.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11921789 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


