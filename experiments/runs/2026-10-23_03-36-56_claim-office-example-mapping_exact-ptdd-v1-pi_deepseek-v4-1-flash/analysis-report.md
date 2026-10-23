# Analysis Report: 2026-10-23_03-36-56_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash

Generated: 2026-10-23T04:07:04+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | deepseek-v4-1-flash |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1804s |
| Started | 2026-10-23T03:36:57+00:00 |
| Ended | 2026-10-23T04:07:04+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts
- **Implementation LOC** (total): 265
- **Test files**: claim.spec.ts, cli.spec.ts, quote.spec.ts
- **Test LOC** (total): 381
- **Active tests**: 41
- **Remaining todos**: 10

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_03-36-56_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_03-36-56_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash

 ✓ src/quote.spec.ts  (26 tests) 8ms
 ✓ src/claim.spec.ts  (14 tests) 5ms
 ❯ src/cli.spec.ts  (11 tests | 1 failed | 10 skipped) 9ms
   ❯ src/cli.spec.ts > claim-office CLI > writes a quote result with the premium for a single-step scenario -- amulet, 5 years, premium 59 G (loyalty applies)
     → expected { results: [] } to deeply equal { results: [ { premium: 59 } ] }

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/cli.spec.ts > claim-office CLI > writes a quote result with the premium for a single-step scenario -- amulet, 5 years, premium 59 G (loyalty applies)
AssertionError: expected { results: [] } to deeply equal { results: [ { premium: 59 } ] }

- Expected
+ Received

  Object {
-   "results": Array [
-     Object {
-       "premium": 59,
-     },
-   ],
+   "results": Array [],
  }

 ❯ src/cli.spec.ts:10:35
      8|       steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      9|     };
     10|     expect(runScenario(scenario)).toEqual({ results: [{ premium: 59 }]…
       |                                   ^
     11|   });
     12|   it.todo("writes a claim result with payout and remainingCap for a tw…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed | 2 passed (3)
      Tests  1 failed | 40 passed | 10 todo (51)
   Start at  04:07:06
   Duration  1.25s (transform 107ms, setup 0ms, collect 167ms, tests 22ms, environment 0ms, prepare 414ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 6 | ×5 | 30 |
| Assignments | 40 | ×6 | 240 |
| **Total Mass** | | | **507** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 223 |
| Functions | 28 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.89 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.40 | 0 |
| Cognitive (SonarJS) | 3 | 1.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6923483 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 84 |
| Predictions Total | 85 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 40 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


