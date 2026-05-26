# Analysis Report: 2026-05-25_16-38-39_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash

Generated: 2026-05-26T13:18:50+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | gemini-3-5-flash |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 110s |
| Started | 2026-05-25T16:38:39+00:00 |
| Ended | 2026-05-25T16:40:30+00:00 |

## Code Metrics

- **Implementation files**: index.ts
- **Implementation LOC** (total): 7
- **Test file**: index.spec.ts
- **Test file LOC**: 91
- **Active tests**: 2
- **Remaining todos**: 30

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-25_16-38-39_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-25_16-38-39_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash

 ❯ src/index.spec.ts  (32 tests | 1 failed | 30 skipped) 6ms
   ❯ src/index.spec.ts > MHPCO Claim Office Policy Management > Quote with a plain sword should return 115 G (100 base + 10 first insurance + 5 fee)
     → expected { results: [ { premium: 5 } ] } to deeply equal { results: [ { premium: 115 } ] }

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/index.spec.ts > MHPCO Claim Office Policy Management > Quote with a plain sword should return 115 G (100 base + 10 first insurance + 5 fee)
AssertionError: expected { results: [ { premium: 5 } ] } to deeply equal { results: [ { premium: 115 } ] }

- Expected
+ Received

  Object {
    "results": Array [
      Object {
-       "premium": 115,
+       "premium": 5,
      },
    ],
  }

 ❯ src/index.spec.ts:36:20
     34|     };
     35|     const output = runScenario(input);
     36|     expect(output).toEqual({
       |                    ^
     37|       results: [{ premium: 115 }]
     38|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 1 passed | 30 todo (32)
   Start at  13:18:53
   Duration  381ms (transform 25ms, setup 0ms, collect 19ms, tests 6ms, environment 0ms, prepare 91ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 1 | ×1 | 1 |
| Invocations | 1 | ×2 | 2 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 0 | ×5 | 0 |
| Assignments | 0 | ×6 | 0 |
| **Total Mass** | | | **3** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 7 |
| Functions | 1 |
| Longest Function | 7 lines |
| Avg LOC/Function | 7.00 |
| Median LOC/Function | 7.00 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 1 | 1.00 | 0 |
| Cognitive (SonarJS) | 0 | 0 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 746077 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


