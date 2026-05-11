# Analysis Report: 2026-05-10_23-00-24_game-of-life-example-mapping_v5.1-minimized_opus-4-6-portkey

Generated: 2026-05-10T23:12:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-minimized |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 738s |
| Started | 2026-05-10T23:00:24+00:00 |
| Ended | 2026-05-10T23:12:43+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 41
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 39
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_23-00-24_game-of-life-example-mapping_v5.1-minimized_opus-4-6-portkey

 ✓ src/game-of-life.spec.ts  (9 tests) 4ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  23:12:44
   Duration  155ms (transform 23ms, setup 0ms, collect 22ms, tests 4ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 10 | ×1 | 10 |
| Invocations | 25 | ×2 | 50 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 7 | ×5 | 35 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **199** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 34 |
| Functions | 5 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.60 |
| Median LOC/Function | 2.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.89 | 0 |
| Cognitive (SonarJS) | 7 | 4.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14526499 |
| Context Utilization | 58% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 76.68s |
| Avg Red Phase | 36s |
| Avg Green Phase | 12.27s |
| Avg Refactor Phase | 28.41s |

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
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


