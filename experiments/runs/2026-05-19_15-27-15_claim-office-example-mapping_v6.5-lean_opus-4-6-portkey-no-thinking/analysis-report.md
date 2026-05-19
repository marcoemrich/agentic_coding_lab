# Analysis Report: 2026-05-19_15-27-15_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T16:02:48+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-lean |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 2132s |
| Started | 2026-05-19T15:27:15+00:00 |
| Ended | 2026-05-19T16:02:48+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 103
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 415
- **Active tests**: 26
- **Remaining todos**: 16

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_15-27-15_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_15-27-15_claim-office-example-mapping_v6.5-lean_opus-4-6-portkey-no-thinking

 ❯ src/claim-office.spec.ts  (42 tests | 1 failed | 16 skipped) 10ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Claim - basic payout > applies 100 G deductible per damaged item
     → expected {} to deeply equal { payout: 400, remainingCap: 1600 }

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Claim - basic payout > applies 100 G deductible per damaged item
AssertionError: expected {} to deeply equal { payout: 400, remainingCap: 1600 }

- Expected
+ Received

- Object {
-   "payout": 400,
-   "remainingCap": 1600,
- }
+ Object {}

 ❯ src/claim-office.spec.ts:378:33
    376|       // damage 500 G - 100 G deductible = 400 G payout
    377|       // remainingCap = 2000 - 400 = 1600
    378|       expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1…
       |                                 ^
    379|     });
    380|     it.todo("applies deductible to each item separately in a multi-ite…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 25 passed | 16 todo (42)
   Start at  16:02:49
   Duration  175ms (transform 36ms, setup 0ms, collect 36ms, tests 10ms, environment 0ms, prepare 45ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 41 | ×1 | 41 |
| Invocations | 36 | ×2 | 72 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 5 | ×5 | 25 |
| Assignments | 35 | ×6 | 210 |
| **Total Mass** | | | **376** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 92 |
| Functions | 7 |
| Longest Function | 16 lines |
| Avg LOC/Function | 9.00 |
| Median LOC/Function | 9.00 |
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
| McCabe (Cyclomatic) | 4 | 1.73 | 0 |
| Cognitive (SonarJS) | 4 | 1.83 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 414186 |
| Context Utilization | 20% |

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


