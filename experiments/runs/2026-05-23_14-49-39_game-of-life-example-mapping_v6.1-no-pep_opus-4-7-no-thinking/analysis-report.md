# Analysis Report: 2026-05-23_14-49-39_game-of-life-example-mapping_v6.1-no-pep_opus-4-7-no-thinking

Generated: 2026-05-23T15:00:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1-no-pep |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 628s |
| Started | 2026-05-23T14:49:39+00:00 |
| Ended | 2026-05-23T15:00:08+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 41
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 53
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_14-49-39_game-of-life-example-mapping_v6.1-no-pep_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_14-49-39_game-of-life-example-mapping_v6.1-no-pep_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (8 tests) 3ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  15:00:09
   Duration  157ms (transform 24ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 4 | ×5 | 20 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **145** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 35 |
| Functions | 5 |
| Longest Function | 12 lines |
| Avg LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 4 | 2.40 | 0 |
| Cognitive (SonarJS) | 4 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7733715 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 105.23s |
| Avg Red Phase | 27.78s |
| Avg Green Phase | 13.09s |
| Avg Refactor Phase | 64.36s |

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
| Tests Passed Immediately | 0 |


