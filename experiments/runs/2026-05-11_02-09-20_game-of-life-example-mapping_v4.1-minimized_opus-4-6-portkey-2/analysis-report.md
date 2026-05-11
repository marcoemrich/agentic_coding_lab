# Analysis Report: 2026-05-11_02-09-20_game-of-life-example-mapping_v4.1-minimized_opus-4-6-portkey-2

Generated: 2026-05-11T02:17:50+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4.1-minimized |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 509s |
| Started | 2026-05-11T02:09:20+00:00 |
| Ended | 2026-05-11T02:17:50+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 48
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 51
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-11_02-09-20_game-of-life-example-mapping_v4.1-minimized_opus-4-6-portkey-2

 ✓ src/game-of-life.spec.ts  (9 tests) 4ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  02:17:50
   Duration  170ms (transform 29ms, setup 0ms, collect 25ms, tests 4ms, environment 0ms, prepare 52ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 28 | ×2 | 56 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 8 | ×5 | 40 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **194** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 40 |
| Functions | 5 |
| Longest Function | 24 lines |
| Avg LOC/Function | 8.80 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 6 | 3.00 | 0 |
| Cognitive (SonarJS) | 10 | 7.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3399874 |
| Context Utilization | 35% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 102.73s |
| Avg Red Phase | 33.82s |
| Avg Green Phase | 25.09s |
| Avg Refactor Phase | 43.82s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 18 |
| Predictions Total | 18 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 8 |


