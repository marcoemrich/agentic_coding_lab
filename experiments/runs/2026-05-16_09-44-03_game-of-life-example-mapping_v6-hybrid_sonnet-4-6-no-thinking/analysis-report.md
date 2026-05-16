# Analysis Report: 2026-05-16_09-44-03_game-of-life-example-mapping_v6-hybrid_sonnet-4-6-no-thinking

Generated: 2026-05-16T09:52:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6-hybrid |
| Model | sonnet-4-6-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 497s |
| Started | 2026-05-16T09:44:03+00:00 |
| Ended | 2026-05-16T09:52:21+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 13
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 32
- **Active tests**: 5
- **Remaining todos**: 4

## Test Results

**Status**: ✅ All tests passing (5 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_09-44-03_game-of-life-example-mapping_v6-hybrid_sonnet-4-6-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_09-44-03_game-of-life-example-mapping_v6-hybrid_sonnet-4-6-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests | 4 skipped) 2ms

 Test Files  1 passed (1)
      Tests  5 passed | 4 todo (9)
   Start at  09:52:21
   Duration  158ms (transform 21ms, setup 0ms, collect 20ms, tests 2ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 4 | ×1 | 4 |
| Invocations | 8 | ×2 | 16 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 0 | ×5 | 0 |
| Assignments | 3 | ×6 | 18 |
| **Total Mass** | | | **38** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 11 |
| Functions | 2 |
| Longest Function | 5 lines |
| Avg LOC/Function | 5.00 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 4 | 1.75 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3332035 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 108.36s |
| Avg Red Phase | 30.63s |
| Avg Green Phase | 21.4s |
| Avg Refactor Phase | 56.33s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 7 |
| Predictions Total | 10 |
| Accuracy | 70% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


