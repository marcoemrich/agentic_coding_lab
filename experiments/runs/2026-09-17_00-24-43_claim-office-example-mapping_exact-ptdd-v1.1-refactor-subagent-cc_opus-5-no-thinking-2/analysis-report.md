# Analysis Report: 2026-09-17_00-24-43_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-2

Generated: 2026-09-22T17:08:28+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 7201s |
| Started | 2026-09-17T00:24:43+00:00 |
| Ended | 2026-09-17T02:24:55+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, component-price-rules.ts, damage-report.ts, damaged-item.ts, item-price-rules.ts, main-item.ts, policy-cover.ts, policy-modifier.ts, policy.ts, premium-contribution.ts, price-list.ts, quote.ts, reimbursement-clause.ts, risk-surcharge.ts, rounding.ts, scenario.ts
- **Implementation LOC** (total): 889
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 415
- **Active tests**: 57
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (57 passed)

```
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.

> tdd-experiment-run@ test /home/memrich/agentic_coding_lab/experiments/runs/2026-09-17_00-24-43_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/memrich/agentic_coding_lab/experiments/runs/2026-09-17_00-24-43_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-2

 ✓ src/claim-office.spec.ts  (57 tests) 948ms

 Test Files  1 passed (1)
      Tests  57 passed (57)
   Start at  17:08:30
   Duration  1.36s (transform 115ms, setup 0ms, collect 127ms, tests 948ms, environment 0ms, prepare 77ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 113 | ×1 | 113 |
| Invocations | 147 | ×2 | 294 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 33 | ×5 | 165 |
| Assignments | 88 | ×6 | 528 |
| **Total Mass** | | | **1152** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 724 |
| Functions | 44 |
| Longest Function | 19 lines |
| Avg LOC/Function | 4.23 |
| Median LOC/Function | 3.00 |
| Imports | 38 |

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
| McCabe (Cyclomatic) | 3 | 1.34 | 0 |
| Cognitive (SonarJS) | 2 | 1.12 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 55103006 |
| Context Utilization | 137% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 57 |
| Avg Cycle Time | 97.10s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 97.1s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 115 |
| Predictions Total | 115 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 57 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


