# Analysis Report: 2026-05-18_23-51-19_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T00:24:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-lean |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 2015s |
| Started | 2026-05-18T23:51:19+00:00 |
| Ended | 2026-05-19T00:24:55+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 152
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 522
- **Active tests**: 28
- **Remaining todos**: 9

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_23-51-19_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_23-51-19_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking

 ❯ src/claim-office.spec.ts  (37 tests | 1 failed | 9 skipped) 12ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Claim - basic payout > reimburses damage to high-enchantment items (>= 8) at 50% minus deductible
     → expected { payout: 400, remainingCap: 1600 } to deeply equal { payout: 150, remainingCap: 1850 }

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Claim - basic payout > reimburses damage to high-enchantment items (>= 8) at 50% minus deductible
AssertionError: expected { payout: 400, remainingCap: 1600 } to deeply equal { payout: 150, remainingCap: 1850 }

- Expected
+ Received

  Object {
-   "payout": 150,
-   "remainingCap": 1850,
+   "payout": 400,
+   "remainingCap": 1600,
  }

 ❯ src/claim-office.spec.ts:498:33
    496|       // high enchantment: 50% of 500 = 250, minus 100 deductible = 150
    497|       // cap = 2000, remaining = 1850
    498|       expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1…
       |                                 ^
    499|     });
    500|     it.todo("applies 50% rule when item has both dragon material and e…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 27 passed | 9 todo (37)
   Start at  00:24:55
   Duration  190ms (transform 44ms, setup 0ms, collect 41ms, tests 12ms, environment 0ms, prepare 46ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 47 | ×2 | 94 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 8 | ×5 | 40 |
| Assignments | 43 | ×6 | 258 |
| **Total Mass** | | | **497** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 131 |
| Functions | 7 |
| Longest Function | 38 lines |
| Avg LOC/Function | 10.14 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 8 |
| Code Quality | 0 |
| **Total** | **11** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 2.36 | 0 |
| Cognitive (SonarJS) | 21 | 5.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 422174 |
| Context Utilization | 21% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
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


