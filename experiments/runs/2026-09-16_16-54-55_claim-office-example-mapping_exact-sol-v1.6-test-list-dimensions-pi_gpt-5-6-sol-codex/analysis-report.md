# Analysis Report: 2026-09-16_16-54-55_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex

Generated: 2026-09-22T17:06:46+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6-test-list-dimensions-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1585s |
| Started | 2026-09-16T16:54:57+00:00 |
| Ended | 2026-09-16T17:21:26+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 214
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 249
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.

> tdd-experiment-run@ test /home/memrich/agentic_coding_lab/experiments/runs/2026-09-16_16-54-55_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/memrich/agentic_coding_lab/experiments/runs/2026-09-16_16-54-55_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex

 ❯ src/claim-office.spec.ts  (39 tests | 1 failed) 11265ms
   ❯ src/claim-office.spec.ts > MHPCO claim office > reads the normative quote-then-claim schema from stdin and writes ordered JSON results to stdout
     → expected '[WARN] The "pnpm" field in package.js…' to be '' // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO claim office > reads the normative quote-then-claim schema from stdin and writes ordered JSON results to stdout
AssertionError: expected '[WARN] The "pnpm" field in package.js…' to be '' // Object.is equality

- Expected
+ Received

+ [WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.
+

 ❯ src/claim-office.spec.ts:246:30
    244|     ] });
    245|     expect(execution.status).toBe(0);
    246|     expect(execution.stderr).toBe("");
       |                              ^
    247|     expect(JSON.parse(execution.stdout)).toEqual({ results: [{ premium…
    248|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 38 passed (39)
   Start at  17:06:48
   Duration  11.67s (transform 82ms, setup 0ms, collect 78ms, tests 11.27s, environment 0ms, prepare 74ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 66 | ×2 | 132 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 7 | ×5 | 35 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **570** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 195 |
| Functions | 13 |
| Longest Function | 23 lines |
| Avg LOC/Function | 7.15 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 4 | 1.72 | 0 |
| Cognitive (SonarJS) | 4 | 1.58 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8378435 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0.0s |
| Avg Green Phase | 0.0s |
| Avg Refactor Phase | 0.0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 78 |
| Predictions Total | 78 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 39 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


