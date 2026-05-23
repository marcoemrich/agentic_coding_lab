# Analysis Report: 2026-05-23_00-18-14_game-of-life-example-mapping_v8b-delayed-refactor-native_opus-4-7-portkey-no-thinking

Generated: 2026-05-23T00:19:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v8b-delayed-refactor-native |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 88s |
| Started | 2026-05-23T00:18:14+00:00 |
| Ended | 2026-05-23T00:19:44+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 39
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 265
- **Active tests**: 19
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (19 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_00-18-14_game-of-life-example-mapping_v8b-delayed-refactor-native_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_00-18-14_game-of-life-example-mapping_v8b-delayed-refactor-native_opus-4-7-portkey-no-thinking

 ✓ src/game-of-life.spec.ts  (19 tests) 6ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  00:19:45
   Duration  182ms (transform 36ms, setup 0ms, collect 30ms, tests 6ms, environment 0ms, prepare 52ms)
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
| Invocations | 24 | ×2 | 48 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 5 | ×5 | 25 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **165** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 33 |
| Functions | 5 |
| Longest Function | 13 lines |
| Avg LOC/Function | 6.80 |
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
| McCabe (Cyclomatic) | 7 | 2.67 | 0 |
| Cognitive (SonarJS) | 12 | 5.67 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 988270 |
| Context Utilization | 5% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 4.60s |
| Avg Red Phase | 2.06s |
| Avg Green Phase | 2.54s |
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


