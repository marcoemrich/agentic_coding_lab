# Analysis Report: 2026-05-15_19-32-13_game-of-life-example-mapping_v6.1-no-app_opus-4-7-no-thinking

Generated: 2026-05-15T19:40:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1-no-app |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 497s |
| Started | 2026-05-15T19:32:13+00:00 |
| Ended | 2026-05-15T19:40:31+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 39
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 49
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-15_19-32-13_game-of-life-example-mapping_v6.1-no-app_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-15_19-32-13_game-of-life-example-mapping_v6.1-no-app_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (8 tests) 2ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  19:40:31
   Duration  166ms (transform 24ms, setup 0ms, collect 22ms, tests 2ms, environment 0ms, prepare 53ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 13 | ×1 | 13 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 5 | ×5 | 25 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **164** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 29 |
| Functions | 3 |
| Longest Function | 32 lines |
| Avg LOC/Function | 12.00 |
| Median LOC/Function | 2.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 3.75 | 0 |
| Cognitive (SonarJS) | 15 | 8.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6404474 |
| Context Utilization | 9% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 95.50s |
| Avg Red Phase | 25.5s |
| Avg Green Phase | 20.78s |
| Avg Refactor Phase | 49.22s |

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
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


