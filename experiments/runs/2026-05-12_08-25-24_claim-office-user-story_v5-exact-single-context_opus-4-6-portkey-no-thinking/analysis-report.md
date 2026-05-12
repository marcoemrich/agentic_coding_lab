# Analysis Report: 2026-05-12_08-25-24_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-12T08:47:28+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 1323s |
| Started | 2026-05-12T08:25:24+00:00 |
| Ended | 2026-05-12T08:47:28+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 55
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 250
- **Active tests**: 10
- **Remaining todos**: 7

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_08-25-24_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_08-25-24_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ❯ src/claim-office.spec.ts  (17 tests | 1 failed | 7 skipped) 9ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Quoting a premium > should apply 15% discount on each contract after the first
     → expected { premium: 105 } to deeply equal { premium: 90 }

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Quoting a premium > should apply 15% discount on each contract after the first
AssertionError: expected { premium: 105 } to deeply equal { premium: 90 }

- Expected
+ Received

  Object {
-   "premium": 90,
+   "premium": 105,
  }

 ❯ src/claim-office.spec.ts:234:33
    232|       expect(result.results[0]).toEqual({ premium: 115 });
    233|       // Second quote: 100G base - 15% returning discount = 85G + 5G f…
    234|       expect(result.results[1]).toEqual({ premium: 90 });
       |                                 ^
    235|     });
    236|     it.todo("should round premiums up (ceiling) in MHPCO's favor");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 9 passed | 7 todo (17)
   Start at  08:47:28
   Duration  211ms (transform 32ms, setup 0ms, collect 33ms, tests 9ms, environment 0ms, prepare 58ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 25 | ×1 | 25 |
| Invocations | 11 | ×2 | 22 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 3 | ×5 | 15 |
| Assignments | 27 | ×6 | 162 |
| **Total Mass** | | | **244** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 53 |
| Functions | 1 |
| Longest Function | 37 lines |
| Avg LOC/Function | 37.00 |
| Median LOC/Function | 37.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 4 |
| Code Quality | 0 |
| **Total** | **7** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 5.00 | 0 |
| Cognitive (SonarJS) | 14 | 14.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 24626759 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 130.60s |
| Avg Red Phase | 32.55s |
| Avg Green Phase | 31.05s |
| Avg Refactor Phase | 67s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 20 |
| Predictions Total | 20 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


