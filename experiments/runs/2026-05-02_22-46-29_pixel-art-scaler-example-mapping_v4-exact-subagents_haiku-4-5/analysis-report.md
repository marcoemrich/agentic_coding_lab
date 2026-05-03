# Analysis Report: 2026-05-02_22-46-29_pixel-art-scaler-example-mapping_v4-exact-subagents_haiku-4-5

Generated: 2026-05-03T11:05:27+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | pixel-art-scaler-example-mapping |
| Workflow | v4-exact-subagents |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 1290s |
| Started | 2026-05-02T22:46:29+00:00 |
| Ended | 2026-05-02T23:08:00+00:00 |

## Code Metrics

- **Implementation file**: pixel-art-scaler.ts
- **Implementation LOC**: 32
- **Test file**: pixel-art-scaler.spec.ts
- **Test file LOC**: 40
- **Active tests**: 11
- **Remaining todos**: 1

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-02_22-46-29_pixel-art-scaler-example-mapping_v4-exact-subagents_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-02_22-46-29_pixel-art-scaler-example-mapping_v4-exact-subagents_haiku-4-5

 ❯ src/pixel-art-scaler.spec.ts  (12 tests | 4 failed | 1 skipped) 8ms
   ❯ src/pixel-art-scaler.spec.ts > Pixel Art Scaler > should scale single pixel vertically by 2x
     → expected [ 'XX' ] to deeply equal [ 'X', 'X' ]
   ❯ src/pixel-art-scaler.spec.ts > Pixel Art Scaler > should scale single row vertically by 2x
     → expected [ 'AABBCC' ] to deeply equal [ 'ABC', 'ABC' ]
   ❯ src/pixel-art-scaler.spec.ts > Pixel Art Scaler > should scale single column horizontally by 2x
     → expected [ 'A', 'A', 'B', 'B' ] to deeply equal [ 'AA', 'BB' ]
   ❯ src/pixel-art-scaler.spec.ts > Pixel Art Scaler > should scale single pixel by 4x
     → expected [ 'XXXX' ] to deeply equal [ 'X', 'X', 'X', 'X' ]

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/pixel-art-scaler.spec.ts > Pixel Art Scaler > should scale single pixel vertically by 2x
AssertionError: expected [ 'XX' ] to deeply equal [ 'X', 'X' ]

- Expected
+ Received

  Array [
-   "X",
-   "X",
+   "XX",
  ]

 ❯ src/pixel-art-scaler.spec.ts:16:29
     14|   });
     15|   it("should scale single pixel vertically by 2x", () => {
     16|     expect(scale(["X"], 2)).toEqual(["X", "X"]);
       |                             ^
     17|   });
     18|   it("should scale single row horizontally by 2x", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  src/pixel-art-scaler.spec.ts > Pixel Art Scaler > should scale single row vertically by 2x
AssertionError: expected [ 'AABBCC' ] to deeply equal [ 'ABC', 'ABC' ]

- Expected
+ Received

  Array [
-   "ABC",
-   "ABC",
+   "AABBCC",
  ]

 ❯ src/pixel-art-scaler.spec.ts:22:31
     20|   });
     21|   it("should scale single row vertically by 2x", () => {
     22|     expect(scale(["ABC"], 2)).toEqual(["ABC", "ABC"]);
       |                               ^
     23|   });
     24|   it("should scale single column horizontally by 2x", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  src/pixel-art-scaler.spec.ts > Pixel Art Scaler > should scale single column horizontally by 2x
AssertionError: expected [ 'A', 'A', 'B', 'B' ] to deeply equal [ 'AA', 'BB' ]

- Expected
+ Received

  Array [
-   "AA",
-   "BB",
+   "A",
+   "A",
+   "B",
+   "B",
  ]

 ❯ src/pixel-art-scaler.spec.ts:25:34
     23|   });
     24|   it("should scale single column horizontally by 2x", () => {
     25|     expect(scale(["A", "B"], 2)).toEqual(["AA", "BB"]);
       |                                  ^
     26|   });
     27|   it("should scale single column vertically by 2x", () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  src/pixel-art-scaler.spec.ts > Pixel Art Scaler > should scale single pixel by 4x
AssertionError: expected [ 'XXXX' ] to deeply equal [ 'X', 'X', 'X', 'X' ]

- Expected
+ Received

  Array [
-   "X",
-   "X",
-   "X",
-   "X",
+   "XXXX",
  ]

 ❯ src/pixel-art-scaler.spec.ts:37:29
     35|   });
     36|   it("should scale single pixel by 4x", () => {
     37|     expect(scale(["X"], 4)).toEqual(["X", "X", "X", "X"]);
       |                             ^
     38|   });
     39|   it.todo("should scale 2x3 grid by 2x");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯

 Test Files  1 failed (1)
      Tests  4 failed | 7 passed | 1 todo (12)
   Start at  11:05:28
   Duration  299ms (transform 65ms, setup 0ms, collect 27ms, tests 8ms, environment 0ms, prepare 128ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 6 | ×1 | 6 |
| Invocations | 17 | ×2 | 34 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 2 | ×5 | 10 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **122** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 22 |
| Functions | 4 |
| Longest Function | 23 lines |
| Avg LOC/Function | 7 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5077064 |
| Context Utilization | 34% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 99.53s |
| Avg Red Phase | 20.49s |
| Avg Green Phase | 37.37s |
| Avg Refactor Phase | 41.67s |

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
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


