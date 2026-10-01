# Analysis Report: 2026-10-01_07-23-14_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-3

Generated: 2026-10-01T08:58:35+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 5715s |
| Started | 2026-10-01T07:23:14+00:00 |
| Ended | 2026-10-01T08:58:35+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, damage-report.ts, node-runtime.d.ts, policy.ts, price-list.ts, quote.ts, reimbursement.ts, risk-surcharge.ts, rounding.ts, scenario.ts
- **Implementation LOC** (total): 544
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 519
- **Active tests**: 53
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (53 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_07-23-14_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_07-23-14_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-3

 ✓ src/claim-office.spec.ts  (53 tests) 2429ms

 Test Files  1 passed (1)
      Tests  53 passed (53)
   Start at  08:58:36
   Duration  2.73s (transform 102ms, setup 0ms, collect 98ms, tests 2.43s, environment 0ms, prepare 64ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 79% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 90 | ×1 | 90 |
| Invocations | 134 | ×2 | 268 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 20 | ×5 | 100 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **800** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 351 |
| Functions | 43 |
| Longest Function | 14 lines |
| Avg LOC/Function | 3.98 |
| Median LOC/Function | 3.00 |
| Imports | 17 |

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
| McCabe (Cyclomatic) | 3 | 1.36 | 0 |
| Cognitive (SonarJS) | 3 | 1.38 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 72843860 |
| Context Utilization | 129% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 53 |
| Avg Cycle Time | 78.33s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 78.33s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 106 |
| Predictions Total | 106 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 53 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


