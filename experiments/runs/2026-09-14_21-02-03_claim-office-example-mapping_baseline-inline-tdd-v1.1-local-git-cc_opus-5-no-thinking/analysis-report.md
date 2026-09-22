# Analysis Report: 2026-09-14_21-02-03_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

Generated: 2026-09-22T16:51:19+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 312s |
| Started | 2026-09-14T21:02:03+00:00 |
| Ended | 2026-09-14T21:07:18+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, pricing.ts, scenario.ts
- **Implementation LOC** (total): 324
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts, pricing.spec.ts
- **Test LOC** (total): 431
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.

> tdd-experiment-run@ test /home/memrich/agentic_coding_lab/experiments/runs/2026-09-14_21-02-03_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/agentic_coding_lab/experiments/runs/2026-09-14_21-02-03_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

 ✓ src/premium.spec.ts  (11 tests) 6ms
 ✓ src/cli.spec.ts  (8 tests) 8ms
 ✓ src/claim.spec.ts  (18 tests) 9ms
 ✓ src/pricing.spec.ts  (13 tests) 6ms

 Test Files  4 passed (4)
      Tests  50 passed (50)
   Start at  16:51:21
   Duration  749ms (transform 167ms, setup 0ms, collect 241ms, tests 29ms, environment 1ms, prepare 455ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 94 | ×2 | 188 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 11 | ×5 | 55 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **716** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 254 |
| Functions | 19 |
| Longest Function | 23 lines |
| Avg LOC/Function | 7.74 |
| Median LOC/Function | 4.00 |
| Imports | 6 |

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
| McCabe (Cyclomatic) | 5 | 2.00 | 0 |
| Cognitive (SonarJS) | 6 | 2.64 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4006256 |
| Context Utilization | 37% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 8.95s |
| Avg Red Phase | 2.01s |
| Avg Green Phase | 6.94s |
| Avg Refactor Phase | 0.0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


