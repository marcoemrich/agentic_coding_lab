# Analysis Report: 2026-05-19_06-49-46_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-3

Generated: 2026-05-19T07:22:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 1945s |
| Started | 2026-05-19T06:49:46+00:00 |
| Ended | 2026-05-19T07:22:13+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 95
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 254
- **Active tests**: 24
- **Remaining todos**: 12

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_06-49-46_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_06-49-46_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-3

 ❯ src/claim-office.spec.ts  (36 tests | 1 failed | 12 skipped) 10ms
   ❯ src/claim-office.spec.ts > Claim - standard reimbursement > reimburses damage minus 100 G deductible for a standard item
     → expected +0 to be 400 // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > Claim - standard reimbursement > reimburses damage minus 100 G deductible for a standard item
AssertionError: expected +0 to be 400 // Object.is equality

- Expected
+ Received

- 400
+ 0

 ❯ src/claim-office.spec.ts:223:27
    221|     });
    222|     // 500 damage - 100 deductible = 400 payout
    223|     expect(result.payout).toBe(400);
       |                           ^
    224|     // cap = 2 × 1000 = 2000, remaining = 2000 - 400 = 1600
    225|     expect(result.remainingCap).toBe(1600);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 23 passed | 12 todo (36)
   Start at  07:22:13
   Duration  240ms (transform 43ms, setup 0ms, collect 41ms, tests 10ms, environment 0ms, prepare 57ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 43 | ×1 | 43 |
| Invocations | 30 | ×2 | 60 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 4 | ×5 | 20 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **421** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 83 |
| Functions | 6 |
| Longest Function | 29 lines |
| Avg LOC/Function | 8.00 |
| Median LOC/Function | 2.50 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 3 | 1.71 | 0 |
| Cognitive (SonarJS) | 3 | 1.57 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 456543 |
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


