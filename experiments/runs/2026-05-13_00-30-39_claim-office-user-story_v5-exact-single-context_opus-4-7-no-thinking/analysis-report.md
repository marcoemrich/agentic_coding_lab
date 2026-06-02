# Analysis Report: 2026-05-13_00-30-39_claim-office-user-story_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-06-02T08:14:35+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | <synthetic> |
| Thinking | unknown |
| Duration | 13073s |
| Started | 2026-05-13T00:30:39+00:00 |
| Ended | 2026-05-13T04:08:33+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 3
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 66
- **Active tests**: 2
- **Remaining todos**: 16

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_00-30-39_claim-office-user-story_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_00-30-39_claim-office-user-story_v5-exact-single-context_opus-4-7-no-thinking

 ❯ src/claim-office.spec.ts  (18 tests | 1 failed | 16 skipped) 6ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > should quote a single amulet for a new customer
     → expected { results: [ { premium: 115 } ] } to deeply equal { results: [ { premium: 71 } ] }

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > should quote a single amulet for a new customer
AssertionError: expected { results: [ { premium: 115 } ] } to deeply equal { results: [ { premium: 71 } ] }

- Expected
+ Received

  Object {
    "results": Array [
      Object {
-       "premium": 71,
+       "premium": 115,
      },
    ],
  }

 ❯ src/claim-office.spec.ts:34:20
     32|     };
     33|     const result = runScenario(input);
     34|     expect(result).toEqual({ results: [{ premium: 71 }] });
       |                    ^
     35|   });
     36|   it.todo("should quote a single staff for a new customer");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 1 passed | 16 todo (18)
   Start at  08:14:35
   Duration  387ms (transform 26ms, setup 0ms, collect 18ms, tests 6ms, environment 0ms, prepare 114ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 1 | ×1 | 1 |
| Invocations | 0 | ×2 | 0 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 0 | ×5 | 0 |
| Assignments | 1 | ×6 | 6 |
| **Total Mass** | | | **7** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 3 |
| Functions | 1 |
| Longest Function | 3 lines |
| Avg LOC/Function | 3.00 |
| Median LOC/Function | 3.00 |
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
| Total Tokens | 0 |
| Context Utilization | 0% |

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


