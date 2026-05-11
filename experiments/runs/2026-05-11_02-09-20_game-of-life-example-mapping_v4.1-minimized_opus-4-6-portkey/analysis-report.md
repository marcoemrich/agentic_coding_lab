# Analysis Report: 2026-05-11_02-09-20_game-of-life-example-mapping_v4.1-minimized_opus-4-6-portkey

Generated: 2026-05-11T02:18:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4.1-minimized |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 572s |
| Started | 2026-05-11T02:09:20+00:00 |
| Ended | 2026-05-11T02:18:53+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 37
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 69
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-11_02-09-20_game-of-life-example-mapping_v4.1-minimized_opus-4-6-portkey

 ✓ src/game-of-life.spec.ts  (11 tests) 4ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  02:18:53
   Duration  172ms (transform 26ms, setup 0ms, collect 24ms, tests 4ms, environment 0ms, prepare 47ms)
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
| Invocations | 21 | ×2 | 42 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 6 | ×5 | 30 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **157** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 31 |
| Functions | 3 |
| Longest Function | 28 lines |
| Avg LOC/Function | 11.67 |
| Median LOC/Function | 4.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 4.25 | 1 |
| Cognitive (SonarJS) | 20 | 20.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3239657 |
| Context Utilization | 34% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 91.43s |
| Avg Red Phase | 38.04s |
| Avg Green Phase | 19.09s |
| Avg Refactor Phase | 34.3s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 23 |
| Predictions Total | 23 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 9 |


