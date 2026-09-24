# Analysis Report: 2026-09-23_14-27-12_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-09-23T15:30:41+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3805s |
| Started | 2026-09-23T14:27:12+00:00 |
| Ended | 2026-09-23T15:30:41+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, policy.ts, price-list.ts, quote.ts, rounding.ts, scenario.ts
- **Implementation LOC** (total): 474
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 351
- **Active tests**: 55
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (55 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_14-27-12_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_14-27-12_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (53 tests) 12ms
 ✓ src/cli.spec.ts  (2 tests) 1090ms

 Test Files  2 passed (2)
      Tests  55 passed (55)
   Start at  15:30:43
   Duration  1.70s (transform 93ms, setup 0ms, collect 124ms, tests 1.10s, environment 0ms, prepare 170ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 76 | ×1 | 76 |
| Invocations | 129 | ×2 | 258 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 20 | ×5 | 100 |
| Assignments | 65 | ×6 | 390 |
| **Total Mass** | | | **876** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 376 |
| Functions | 40 |
| Longest Function | 15 lines |
| Avg LOC/Function | 4.78 |
| Median LOC/Function | 3.00 |
| Imports | 10 |

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
| McCabe (Cyclomatic) | 3 | 1.33 | 0 |
| Cognitive (SonarJS) | 4 | 1.29 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 39442301 |
| Context Utilization | 108% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 53 |
| Avg Cycle Time | 86.17s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 86.17s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 107 |
| Predictions Total | 109 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 29 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


