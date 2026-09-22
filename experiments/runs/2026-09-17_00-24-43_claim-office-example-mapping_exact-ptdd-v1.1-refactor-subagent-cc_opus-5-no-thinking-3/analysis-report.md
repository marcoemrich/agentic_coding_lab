# Analysis Report: 2026-09-17_00-24-43_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-3

Generated: 2026-09-22T17:09:10+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 4715s |
| Started | 2026-09-17T00:24:43+00:00 |
| Ended | 2026-09-17T01:43:29+00:00 |

## Code Metrics

- **Implementation files**: claim-office-refusal.ts, claim-office.ts, claim-settlement.ts, cli.ts, item-catalogue.ts, policy-register.ts, scenario.ts
- **Implementation LOC** (total): 534
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 380
- **Active tests**: 52
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.

> tdd-experiment-run@ test /home/memrich/agentic_coding_lab/experiments/runs/2026-09-17_00-24-43_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/memrich/agentic_coding_lab/experiments/runs/2026-09-17_00-24-43_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-3

 ✓ src/claim-office.spec.ts  (52 tests) 6955ms

 Test Files  1 passed (1)
      Tests  52 passed (52)
   Start at  17:09:12
   Duration  7.40s (transform 93ms, setup 0ms, collect 95ms, tests 6.96s, environment 0ms, prepare 79ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 72% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 77 | ×1 | 77 |
| Invocations | 147 | ×2 | 294 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 18 | ×5 | 90 |
| Assignments | 69 | ×6 | 414 |
| **Total Mass** | | | **919** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 351 |
| Functions | 42 |
| Longest Function | 13 lines |
| Avg LOC/Function | 4.38 |
| Median LOC/Function | 3.00 |
| Imports | 12 |

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
| McCabe (Cyclomatic) | 3 | 1.38 | 0 |
| Cognitive (SonarJS) | 3 | 1.18 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 41723297 |
| Context Utilization | 116% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 53 |
| Avg Cycle Time | 83.39s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 83.39s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 99 |
| Predictions Total | 103 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 40 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


