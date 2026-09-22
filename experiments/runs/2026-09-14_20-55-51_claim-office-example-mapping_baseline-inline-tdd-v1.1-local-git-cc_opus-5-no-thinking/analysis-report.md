# Analysis Report: 2026-09-14_20-55-51_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

Generated: 2026-09-22T16:49:00+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 213s |
| Started | 2026-09-14T20:55:51+00:00 |
| Ended | 2026-09-14T20:59:28+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, domain.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 316
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 436
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (49 passed)

```
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.

> tdd-experiment-run@ test /home/memrich/agentic_coding_lab/experiments/runs/2026-09-14_20-55-51_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/agentic_coding_lab/experiments/runs/2026-09-14_20-55-51_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

 ✓ src/claim.spec.ts  (15 tests) 8ms
 ✓ src/premium.spec.ts  (24 tests) 7ms
 ✓ src/scenario.spec.ts  (5 tests) 7ms
 ✓ src/cli.spec.ts  (5 tests) 4703ms

 Test Files  4 passed (4)
      Tests  49 passed (49)
   Start at  16:49:02
   Duration  5.11s (transform 200ms, setup 0ms, collect 212ms, tests 4.72s, environment 1ms, prepare 524ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 74 | ×1 | 74 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 13 | ×5 | 65 |
| Assignments | 64 | ×6 | 384 |
| **Total Mass** | | | **767** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 261 |
| Functions | 14 |
| Longest Function | 28 lines |
| Avg LOC/Function | 8.00 |
| Median LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 5 | 2.19 | 0 |
| Cognitive (SonarJS) | 6 | 2.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1259607 |
| Context Utilization | 29% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


