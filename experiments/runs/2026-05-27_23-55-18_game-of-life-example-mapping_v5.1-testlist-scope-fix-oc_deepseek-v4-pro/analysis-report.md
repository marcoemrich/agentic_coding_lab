# Analysis Report: 2026-05-27_23-55-18_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-pro

Generated: 2026-05-28T01:55:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | deepseek-v4-pro |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 7202s |
| Started | 2026-05-27T23:55:18+00:00 |
| Ended | 2026-05-28T01:55:21+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 10
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 35
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-27_23-55-18_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-pro
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-27_23-55-18_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-pro

 ❯ src/game-of-life.spec.ts  (8 tests | 1 failed) 8ms
   ❯ src/game-of-life.spec.ts > Game of Life - Next Generation > should produce correct next generation for a blinker oscillator Gen 0 → Gen 1 -- [(1,0),(1,1),(1,2)] → [(0,1),(1,1),(2,1)]
     → expected [ [ +0, +0 ], [ 1, +0 ], …(2) ] to deeply equal [ [ +0, 1 ], [ 1, 1 ], [ 2, 1 ] ]

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/game-of-life.spec.ts > Game of Life - Next Generation > should produce correct next generation for a blinker oscillator Gen 0 → Gen 1 -- [(1,0),(1,1),(1,2)] → [(0,1),(1,1),(2,1)]
AssertionError: expected [ [ +0, +0 ], [ 1, +0 ], …(2) ] to deeply equal [ [ +0, 1 ], [ 1, 1 ], [ 2, 1 ] ]

- Expected
+ Received

  Array [
    Array [
      0,
-     1,
+     0,
    ],
    Array [
      1,
+     0,
+   ],
+   Array [
+     0,
      1,
    ],
    Array [
-     2,
+     1,
      1,
    ],
  ]

 ❯ src/game-of-life.spec.ts:34:54
     32| 
     33|   it("should produce correct next generation for a blinker oscillator …
     34|     expect(nextGeneration([[1, 0], [1, 1], [1, 2]])).toEqual([[0, 1], …
       |                                                      ^
     35|   });
     36| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 7 passed (8)
   Start at  01:55:21
   Duration  159ms (transform 22ms, setup 0ms, collect 19ms, tests 8ms, environment 0ms, prepare 49ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 28 | ×1 | 28 |
| Invocations | 6 | ×2 | 12 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 0 | ×5 | 0 |
| Assignments | 2 | ×6 | 12 |
| **Total Mass** | | | **68** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 10 |
| Functions | 1 |
| Longest Function | 9 lines |
| Avg LOC/Function | 9.00 |
| Median LOC/Function | 9.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 9 |
| Code Quality | 0 |
| **Total** | **9** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 3.00 | 0 |
| Cognitive (SonarJS) | 5 | 5.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2095409 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 4 |
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


