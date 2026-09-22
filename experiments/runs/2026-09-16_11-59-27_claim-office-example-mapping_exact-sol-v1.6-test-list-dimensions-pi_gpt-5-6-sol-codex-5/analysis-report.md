# Analysis Report: 2026-09-16_11-59-27_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex-5

Generated: 2026-09-22T16:58:20+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6-test-list-dimensions-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 826s |
| Started | 2026-09-16T11:59:29+00:00 |
| Ended | 2026-09-16T12:13:23+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 135
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 74
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.

> tdd-experiment-run@ test /home/memrich/agentic_coding_lab/experiments/runs/2026-09-16_11-59-27_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex-5
> vitest run


 RUN  v1.6.1 /home/memrich/agentic_coding_lab/experiments/runs/2026-09-16_11-59-27_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex-5

 ❯ src/claim-office.spec.ts  (41 tests | 1 failed) 3862ms
   ❯ src/claim-office.spec.ts > MHPCO claim office > CLI reads a scenario from stdin and writes only JSON results to stdout
     → expected { status: +0, …(2) } to deeply equal { status: +0, …(2) }

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO claim office > CLI reads a scenario from stdin and writes only JSON results to stdout
AssertionError: expected { status: +0, …(2) } to deeply equal { status: +0, …(2) }

- Expected
+ Received

  Object {
    "status": 0,
-   "stderr": "",
+   "stderr": "[WARN] The \"pnpm\" field in package.json is no longer read by pnpm. The following keys were ignored: \"pnpm.onlyBuiltDependencies\". See https://pnpm.io/settings for the new home of each setting.
+ ",
    "stdout": "{\"results\":[{\"premium\":5}]}",
  }

 ❯ src/claim-office.spec.ts:65:76
     63|     const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "qu…
     64|     const run = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { inp…
     65|     expect({ status: run.status, stdout: run.stdout, stderr: run.stder…
       |                                                                            ^
     66|   });
     67|   it("CLI exits non-zero, writes an error to stderr, and writes no res…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 40 passed (41)
   Start at  16:58:22
   Duration  4.28s (transform 64ms, setup 0ms, collect 73ms, tests 3.86s, environment 0ms, prepare 92ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 61 | ×2 | 122 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 7 | ×5 | 35 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **579** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 120 |
| Functions | 12 |
| Longest Function | 16 lines |
| Avg LOC/Function | 5.75 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.79 | 0 |
| Cognitive (SonarJS) | 3 | 1.88 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1876791 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0.0s |
| Avg Green Phase | 0.0s |
| Avg Refactor Phase | 0.0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 22 |
| Predictions Total | 22 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


