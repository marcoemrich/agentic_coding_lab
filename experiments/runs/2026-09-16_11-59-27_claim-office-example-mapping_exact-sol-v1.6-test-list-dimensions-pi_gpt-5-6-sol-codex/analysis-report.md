# Analysis Report: 2026-09-16_11-59-27_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex

Generated: 2026-09-22T16:55:04+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6-test-list-dimensions-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1539s |
| Started | 2026-09-16T11:59:29+00:00 |
| Ended | 2026-09-16T12:25:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 182
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 266
- **Active tests**: 48
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.

> tdd-experiment-run@ test /home/memrich/agentic_coding_lab/experiments/runs/2026-09-16_11-59-27_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/memrich/agentic_coding_lab/experiments/runs/2026-09-16_11-59-27_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex

 ❯ src/claim-office.spec.ts  (48 tests | 1 failed) 10943ms
   ❯ src/claim-office.spec.ts > MHPCO claim office > processes the normative sequential quote/claim schema and emits ordered results: premium 59, payout 100, remainingCap 1100
     → expected '[WARN] The "pnpm" field in package.js…' to be '' // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO claim office > processes the normative sequential quote/claim schema and emits ordered results: premium 59, payout 100, remainingCap 1100
AssertionError: expected '[WARN] The "pnpm" field in package.js…' to be '' // Object.is equality

- Expected
+ Received

+ [WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.
+

 ❯ src/claim-office.spec.ts:261:27
    259|     ] });
    260|     expect(result.status).toBe(0);
    261|     expect(result.stderr).toBe("");
       |                           ^
    262|     expect(JSON.parse(result.stdout)).toEqual({ results: [
    263|       { premium: 59 }, { payout: 100, remainingCap: 1100 },

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 47 passed (48)
   Start at  16:55:06
   Duration  11.36s (transform 84ms, setup 0ms, collect 82ms, tests 10.94s, environment 0ms, prepare 87ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 66 | ×2 | 132 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 9 | ×5 | 45 |
| Assignments | 74 | ×6 | 444 |
| **Total Mass** | | | **704** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 161 |
| Functions | 15 |
| Longest Function | 19 lines |
| Avg LOC/Function | 5.67 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 3 | 1.50 | 0 |
| Cognitive (SonarJS) | 2 | 1.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11127662 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 48 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0.0s |
| Avg Green Phase | 0.0s |
| Avg Refactor Phase | 0.0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 96 |
| Predictions Total | 96 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 48 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


