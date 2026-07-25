# Analysis Report: 2026-07-25_02-01-15_claim-office-example-mapping_v6.2.1-phase-continuation-pi_minimax-m3-no-thinking

Generated: 2026-07-25T13:06:17+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | minimax-m3-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 13707s |
| Started | 2026-07-25T02:01:15+00:00 |
| Ended | 2026-07-25T05:49:43+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, policy.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 389
- **Test file**: policy.spec.ts
- **Test file LOC**: 131
- **Active tests**: 21
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_02-01-15_claim-office-example-mapping_v6.2.1-phase-continuation-pi_minimax-m3-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_02-01-15_claim-office-example-mapping_v6.2.1-phase-continuation-pi_minimax-m3-no-thinking

 ✓ src/quote.spec.ts  (23 tests) 6ms
 ✓ src/policy.spec.ts  (21 tests) 4ms
 ❯ src/scenario.spec.ts  (15 tests | 1 failed) 1245ms
   ❯ src/scenario.spec.ts > CLI subprocess > reads JSON from stdin, writes JSON to stdout for valid scenario
     → expected 'npm warn Unknown env config "npm-glob…' to be '' // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/scenario.spec.ts > CLI subprocess > reads JSON from stdin, writes JSON to stdout for valid scenario
AssertionError: expected 'npm warn Unknown env config "npm-glob…' to be '' // Object.is equality

- Expected
+ Received

+ npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
+ npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
+ npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
+

 ❯ src/scenario.spec.ts:138:27
    136|     expect(result.exitCode).toBe(0);
    137|     expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 1…
    138|     expect(result.stderr).toBe("");
       |                           ^
    139|   });
    140|   it("exits non-zero with stderr error and empty stdout on unknown ite…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed | 2 passed (3)
      Tests  1 failed | 58 passed (59)
   Start at  13:06:18
   Duration  1.61s (transform 78ms, setup 1ms, collect 110ms, tests 1.25s, environment 1ms, prepare 270ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 103 | ×1 | 103 |
| Invocations | 100 | ×2 | 200 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 20 | ×5 | 100 |
| Assignments | 72 | ×6 | 432 |
| **Total Mass** | | | **919** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 318 |
| Functions | 18 |
| Longest Function | 20 lines |
| Avg LOC/Function | 5.72 |
| Median LOC/Function | 5.00 |
| Imports | 3 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 2.26 | 0 |
| Cognitive (SonarJS) | 8 | 2.21 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10311036 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


