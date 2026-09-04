# Analysis Report: 2026-09-04_07-07-48_claim-office-example-mapping_v11-superpowers-tdd_opus-5-no-thinking

Generated: 2026-09-04T07:15:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v11-superpowers-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 483s |
| Started | 2026-09-04T07:07:48+00:00 |
| Ended | 2026-09-04T07:15:53+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, policy.ts, premium.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 320
- **Test files**: claim.spec.ts, cli.spec.ts, policy.spec.ts, premium.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 519
- **Active tests**: 58
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (58 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_07-07-48_claim-office-example-mapping_v11-superpowers-tdd_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_07-07-48_claim-office-example-mapping_v11-superpowers-tdd_opus-5-no-thinking

 ✓ src/claim.spec.ts  (14 tests) 6ms
 ✓ src/scenario.spec.ts  (7 tests) 5ms
 ✓ src/premium.spec.ts  (17 tests) 4ms
 ✓ src/cli.spec.ts  (3 tests) 1483ms
 ✓ src/quote.spec.ts  (8 tests) 4ms
 ✓ src/policy.spec.ts  (9 tests) 4ms

 Test Files  6 passed (6)
      Tests  58 passed (58)
   Start at  07:15:54
   Duration  2.97s (transform 148ms, setup 1ms, collect 199ms, tests 1.51s, environment 1ms, prepare 450ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 12 | ×5 | 60 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **697** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 260 |
| Functions | 18 |
| Longest Function | 18 lines |
| Avg LOC/Function | 7.00 |
| Median LOC/Function | 6.00 |
| Imports | 9 |

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
| McCabe (Cyclomatic) | 4 | 1.81 | 0 |
| Cognitive (SonarJS) | 3 | 1.79 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10955398 |
| Context Utilization | 50% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 12.13s |
| Avg Red Phase | 3.41s |
| Avg Green Phase | 2.19s |
| Avg Refactor Phase | 6.53s |

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
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


