# Analysis Report: 2026-05-10_09-54-00_game-of-life-example-mapping_v4-exact-subagents_haiku-4-5

Generated: 2026-05-10T10:11:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4-exact-subagents |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 1059s |
| Started | 2026-05-10T09:54:00+00:00 |
| Ended | 2026-05-10T10:11:42+00:00 |

## Code Metrics

- **Implementation file**: game-of-life.ts
- **Implementation LOC**: 63
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 38
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_09-54-00_game-of-life-example-mapping_v4-exact-subagents_haiku-4-5

 ❯ src/game-of-life.spec.ts  (7 tests | 1 failed) 7ms
   ❯ src/game-of-life.spec.ts > Game of Life - Next Generation > should eliminate overpopulated cell with 4 neighbors
     → expected [ [ +0, +0 ], [ +0, 1 ], …(3) ] to deeply equal [ Array(4) ]

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/game-of-life.spec.ts > Game of Life - Next Generation > should eliminate overpopulated cell with 4 neighbors
AssertionError: expected [ [ +0, +0 ], [ +0, 1 ], …(3) ] to deeply equal [ Array(4) ]

- Expected
+ Received

  Array [
    Array [
      0,
+     0,
+   ],
+   Array [
+     0,
      1,
    ],
    Array [
      1,
      0,
    ],
    Array [
      1,
      1,
    ],
    Array [
      -1,
-     0,
+     1,
    ],
  ]

 ❯ src/game-of-life.spec.ts:16:71
     14|   it("should eliminate overpopulated cell with 4 neighbors", () => {
     15|     // A cell at [0, 0] with 4 neighbors should die from overpopulation
     16|     expect(nextGeneration([[0, 0], [0, 1], [1, 0], [1, 1], [-1, 0]])).…
       |                                                                       ^
     17|   });
     18|   it("should create new cell from reproduction (dead cell with exactly…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 6 passed (7)
   Start at  10:11:42
   Duration  155ms (transform 23ms, setup 0ms, collect 21ms, tests 7ms, environment 0ms, prepare 42ms)

[ELIFECYCLE] Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 23 | ×2 | 46 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 1 | ×5 | 5 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **225** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 47 |
| Functions | 5 |
| Longest Function | 37 lines |
| Avg LOC/Function | 11 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 6 |
| Code Quality | 0 |
| **Total** | **7** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 12 | 4.40 | 1 |
| Cognitive (SonarJS) | 12 | 4.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5742456 |
| Context Utilization | 36% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 126.62s |
| Avg Red Phase | 26.67s |
| Avg Green Phase | 45.77s |
| Avg Refactor Phase | 54.18s |

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
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


