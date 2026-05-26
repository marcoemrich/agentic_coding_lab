# Analysis Report: 2026-05-26_01-51-03_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey

Generated: 2026-05-26T02:04:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-7-portkey |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 796s |
| Started | 2026-05-26T01:51:03+00:00 |
| Ended | 2026-05-26T02:04:22+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 45
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 56
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_01-51-03_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_01-51-03_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey

 ✓ src/game-of-life.spec.ts  (9 tests) 8ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  02:04:23
   Duration  290ms (transform 38ms, setup 0ms, collect 31ms, tests 8ms, environment 0ms, prepare 77ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 25 | ×1 | 25 |
| Invocations | 15 | ×2 | 30 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 4 | ×5 | 20 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **141** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 37 |
| Functions | 3 |
| Longest Function | 16 lines |
| Avg LOC/Function | 6.67 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 5 | 2.20 | 0 |
| Cognitive (SonarJS) | 4 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9615809 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 84.20s |
| Avg Red Phase | 26.37s |
| Avg Green Phase | 10.33s |
| Avg Refactor Phase | 47.5s |

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


