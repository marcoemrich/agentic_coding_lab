# Analysis Report: 2026-09-17_00-24-43_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-09-17T01:24:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3574s |
| Started | 2026-09-17T00:24:43+00:00 |
| Ended | 2026-09-17T01:24:26+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claims.ts, cli.ts, component-blocks.ts, customer-standing.ts, customer.ts, item-risk.ts, item.ts, mhpco-rounding.ts, policy-coverage.ts, price-list.ts, processing-fee.ts, scenario.ts
- **Implementation LOC** (total): 791
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 436
- **Active tests**: 55
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (55 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-17_00-24-43_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-17_00-24-43_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (49 tests) 15ms
 ✓ src/cli.spec.ts  (6 tests) 3309ms

 Test Files  2 passed (2)
      Tests  55 passed (55)
   Start at  01:24:27
   Duration  4.05s (transform 149ms, setup 0ms, collect 168ms, tests 3.32s, environment 0ms, prepare 219ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 80% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 91 | ×1 | 91 |
| Invocations | 119 | ×2 | 238 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 45 | ×5 | 225 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **1032** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 636 |
| Functions | 32 |
| Longest Function | 11 lines |
| Avg LOC/Function | 5.06 |
| Median LOC/Function | 3.50 |
| Imports | 22 |

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
| McCabe (Cyclomatic) | 3 | 1.22 | 0 |
| Cognitive (SonarJS) | 2 | 1.09 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 28328974 |
| Context Utilization | 96% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 46 |
| Avg Cycle Time | 88.33s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 88.33s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 85 |
| Predictions Total | 88 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 28 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


