# Analysis Report: 2026-05-11_03-41-15_game-of-life-example-mapping_v4.2-conservative_opus-4-6-portkey

Generated: 2026-05-11T03:56:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4.2-conservative |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 884s |
| Started | 2026-05-11T03:41:15+00:00 |
| Ended | 2026-05-11T03:56:01+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 43
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 46
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-11_03-41-15_game-of-life-example-mapping_v4.2-conservative_opus-4-6-portkey

 ✓ src/game-of-life.spec.ts  (8 tests) 3ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  03:56:02
   Duration  157ms (transform 28ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 13 | ×1 | 13 |
| Invocations | 28 | ×2 | 56 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 7 | ×5 | 35 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **172** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 38 |
| Functions | 3 |
| Longest Function | 28 lines |
| Avg LOC/Function | 13.67 |
| Median LOC/Function | 10.00 |
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
| McCabe (Cyclomatic) | 7 | 2.83 | 0 |
| Cognitive (SonarJS) | 8 | 5.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5187308 |
| Context Utilization | 41% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 134.78s |
| Avg Red Phase | 31.36s |
| Avg Green Phase | 51.17s |
| Avg Refactor Phase | 52.25s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


