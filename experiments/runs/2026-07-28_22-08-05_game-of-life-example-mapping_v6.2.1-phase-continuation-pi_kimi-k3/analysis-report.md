# Analysis Report: 2026-07-28_22-08-05_game-of-life-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3

Generated: 2026-07-28T22:10:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | kimi-k3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 138s |
| Started | 2026-07-28T22:08:05+00:00 |
| Ended | 2026-07-28T22:10:25+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 35
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 57
- **Active tests**: 5
- **Remaining todos**: 5

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-28_22-08-05_game-of-life-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-28_22-08-05_game-of-life-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3

 ❯ src/game-of-life.spec.ts  (10 tests | 1 failed | 5 skipped) 12ms
   ❯ src/game-of-life.spec.ts > Game of Life - Next Generation > should keep a live cell with 2 or 3 live neighbors alive (survival) -- center (1,1) with 3 neighbors survives
     → expected [ [ +0, 1 ], [ 1, -1 ], …(2) ] to deep equally contain [ 1, 1 ]

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/game-of-life.spec.ts > Game of Life - Next Generation > should keep a live cell with 2 or 3 live neighbors alive (survival) -- center (1,1) with 3 neighbors survives
AssertionError: expected [ [ +0, 1 ], [ 1, -1 ], …(2) ] to deep equally contain [ 1, 1 ]

- Expected
+ Received

  Array [
+   Array [
+     0,
+     1,
+   ],
+   Array [
+     1,
+     -1,
+   ],
+   Array [
      1,
+     0,
+   ],
+   Array [
+     2,
      1,
+   ],
  ]

 ❯ src/game-of-life.spec.ts:36:20
     34|         [1, 2],
     35|       ]);
     36|       expect(next).toContainEqual([1, 1]);
       |                    ^
     37|       expect(next).toContainEqual([1, 0]);
     38|       expect(next).toContainEqual([1, 2]);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 4 passed | 5 todo (10)
   Start at  22:10:25
   Duration  185ms (transform 25ms, setup 0ms, collect 22ms, tests 12ms, environment 0ms, prepare 45ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 18 | ×2 | 36 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 5 | ×5 | 25 |
| Assignments | 6 | ×6 | 36 |
| **Total Mass** | | | **122** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 29 |
| Functions | 3 |
| Longest Function | 19 lines |
| Avg LOC/Function | 8.33 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 6 | 2.75 | 0 |
| Cognitive (SonarJS) | 7 | 4.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 658223 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


