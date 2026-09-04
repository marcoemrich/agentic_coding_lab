# Analysis Report: 2026-09-04_07-05-55_claim-office-example-mapping_v11-superpowers-tdd_opus-5-no-thinking

Generated: 2026-09-04T07:15:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v11-superpowers-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 565s |
| Started | 2026-09-04T07:05:55+00:00 |
| Ended | 2026-09-04T07:15:22+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, policy.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 233
- **Test files**: claim.spec.ts, cli.spec.ts, policy.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 451
- **Active tests**: 48
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (56 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_07-05-55_claim-office-example-mapping_v11-superpowers-tdd_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_07-05-55_claim-office-example-mapping_v11-superpowers-tdd_opus-5-no-thinking

 ✓ src/quote.spec.ts  (25 tests) 5ms
 ✓ src/claim.spec.ts  (16 tests) 7ms
 ✓ src/scenario.spec.ts  (6 tests) 4ms
 ✓ src/cli.spec.ts  (5 tests) 2726ms
 ✓ src/policy.spec.ts  (4 tests) 2ms

 Test Files  5 passed (5)
      Tests  56 passed (56)
   Start at  07:15:23
   Duration  3.94s (transform 118ms, setup 0ms, collect 180ms, tests 2.74s, environment 1ms, prepare 358ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 74 | ×2 | 148 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 10 | ×5 | 50 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **637** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 188 |
| Functions | 13 |
| Longest Function | 25 lines |
| Avg LOC/Function | 9.08 |
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
| McCabe (Cyclomatic) | 4 | 1.95 | 0 |
| Cognitive (SonarJS) | 5 | 2.40 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12785255 |
| Context Utilization | 53% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 16 |
| Avg Cycle Time | 8.20s |
| Avg Red Phase | 3.87s |
| Avg Green Phase | 3s |
| Avg Refactor Phase | 1.33s |

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
| Tests Passed Immediately | 2 |


