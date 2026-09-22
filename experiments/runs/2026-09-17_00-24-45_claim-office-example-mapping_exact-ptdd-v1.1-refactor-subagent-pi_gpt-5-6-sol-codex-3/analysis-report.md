# Analysis Report: 2026-09-17_00-24-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex-3

Generated: 2026-09-22T17:13:26+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4444s |
| Started | 2026-09-17T00:24:50+00:00 |
| Ended | 2026-09-17T01:39:02+00:00 |

## Code Metrics

- **Implementation files**: claim-coverage.ts, claim-damage-validation.ts, claim-deductible.ts, claim-office.ts, claim-reimbursement.ts, cli.ts, item-catalogue.ts, policy-base-premium.ts, policy-payout-cap.ts
- **Implementation LOC** (total): 254
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 197
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.

> tdd-experiment-run@ test /home/memrich/agentic_coding_lab/experiments/runs/2026-09-17_00-24-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex-3
> vitest run


 RUN  v1.6.1 /home/memrich/agentic_coding_lab/experiments/runs/2026-09-17_00-24-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex-3

 ❯ src/claim-office.spec.ts  (37 tests | 1 failed) 11370ms
   ❯ src/claim-office.spec.ts > MHPCO claim office > outputs one ordered result per step using the binding JSON field names
     → expected '[WARN] The "pnpm" field in package.js…' to be '' // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO claim office > outputs one ordered result per step using the binding JSON field names
AssertionError: expected '[WARN] The "pnpm" field in package.js…' to be '' // Object.is equality

- Expected
+ Received

+ [WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.
+

 ❯ src/claim-office.spec.ts:94:24
     92|     expect(run.status).toBe(0);
     93|     expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 5 },…
     94|     expect(run.stderr).toBe("");
       |                        ^
     95|   });
     96|   it("pays 400 G for standard 500 G sword damage after one 100 G deduc…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 36 passed (37)
   Start at  17:13:28
   Duration  11.86s (transform 108ms, setup 0ms, collect 118ms, tests 11.37s, environment 0ms, prepare 114ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 76 | ×1 | 76 |
| Invocations | 96 | ×2 | 192 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 6 | ×5 | 30 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **628** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 216 |
| Functions | 30 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.03 |
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
| McCabe (Cyclomatic) | 4 | 1.52 | 0 |
| Cognitive (SonarJS) | 3 | 1.21 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15012350 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0.0s |
| Avg Green Phase | 0.0s |
| Avg Refactor Phase | 0.0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 74 |
| Predictions Total | 74 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 37 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


