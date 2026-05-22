# Analysis Report: 2026-05-21_10-51-08_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-21T12:21:09+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 5400s |
| Started | 2026-05-21T10:51:08+00:00 |
| Ended | 2026-05-21T12:21:09+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 108
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 658
- **Active tests**: 38
- **Remaining todos**: 11

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_10-51-08_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_10-51-08_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking

 ❯ src/claim-office.spec.ts  (49 tests | 1 failed | 11 skipped) 10ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > claim -- cap > cap exhaustion second claim: damage 1500 G => payout 600 G (capped to remaining), remaining cap 0 G
     → expected 1400 to be 600 // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > claim -- cap > cap exhaustion second claim: damage 1500 G => payout 600 G (capped to remaining), remaining cap 0 G
AssertionError: expected 1400 to be 600 // Object.is equality

- Expected
+ Received

- 600
+ 1400

 ❯ src/claim-office.spec.ts:592:29
    590|         damages: [{ type: "sword", amount: 1500 }],
    591|       }, { previousPayouts: 1400 });
    592|       expect(result.payout).toBe(600);
       |                             ^
    593|       expect(result.remainingCap).toBe(0);
    594|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 37 passed | 11 todo (49)
   Start at  12:21:10
   Duration  228ms (transform 49ms, setup 0ms, collect 60ms, tests 10ms, environment 0ms, prepare 50ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 40 | ×1 | 40 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 5 | ×5 | 25 |
| Assignments | 42 | ×6 | 252 |
| **Total Mass** | | | **389** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 92 |
| Functions | 6 |
| Longest Function | 21 lines |
| Avg LOC/Function | 11.33 |
| Median LOC/Function | 9.00 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 7 | 3.43 | 0 |
| Cognitive (SonarJS) | 5 | 2.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11240775 |
| Context Utilization | 56% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 193.21s |
| Avg Red Phase | 59.51s |
| Avg Green Phase | 48.18s |
| Avg Refactor Phase | 85.52s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 142 |
| Predictions Total | 143 |
| Accuracy | 99% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


