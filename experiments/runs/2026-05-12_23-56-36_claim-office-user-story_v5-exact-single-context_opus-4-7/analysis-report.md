# Analysis Report: 2026-05-12_23-56-36_claim-office-user-story_v5-exact-single-context_opus-4-7

Generated: 2026-05-13T00:04:28+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7, <synthetic> |
| Thinking | true |
| Duration | 471s |
| Started | 2026-05-12T23:56:36+00:00 |
| Ended | 2026-05-13T00:04:28+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 59
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 83
- **Active tests**: 6
- **Remaining todos**: 9

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_23-56-36_claim-office-user-story_v5-exact-single-context_opus-4-7
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_23-56-36_claim-office-user-story_v5-exact-single-context_opus-4-7

 ❯ src/claim-office.spec.ts  (15 tests | 1 failed | 9 skipped) 7ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > applies the special 60 G premium for a block of 3 alike components
     → expected { results: [ { premium: 88 } ] } to deeply equal { results: [ { premium: 71 } ] }

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > applies the special 60 G premium for a block of 3 alike components
AssertionError: expected { results: [ { premium: 88 } ] } to deeply equal { results: [ { premium: 71 } ] }

- Expected
+ Received

  Object {
    "results": Array [
      Object {
-       "premium": 71,
+       "premium": 88,
      },
    ],
  }

 ❯ src/claim-office.spec.ts:72:20
     70|       steps: [{ op: "quote", items: [rune, rune, rune] }],
     71|     });
     72|     expect(result).toEqual({ results: [{ premium: 71 }] });
       |                    ^
     73|   });
     74|   it.todo("adds a 50% surcharge for cursed items");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 5 passed | 9 todo (15)
   Start at  00:04:28
   Duration  155ms (transform 24ms, setup 0ms, collect 22ms, tests 7ms, environment 0ms, prepare 43ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 11 | ×1 | 11 |
| Invocations | 4 | ×2 | 8 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 2 | ×5 | 10 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **95** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 46 |
| Functions | 4 |
| Longest Function | 6 lines |
| Avg LOC/Function | 3.25 |
| Median LOC/Function | 2.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 2 | 1.25 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8819846 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 73.13s |
| Avg Red Phase | 21.62s |
| Avg Green Phase | 37.44s |
| Avg Refactor Phase | 14.07s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 12 |
| Predictions Total | 12 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


