# Analysis Report: 2026-08-10_15-35-04_game-of-life-example-mapping_v3-basic-tdd_opus-5-no-thinking

Generated: 2026-08-10T15:37:29+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 143s |
| Started | 2026-08-10T15:35:04+00:00 |
| Ended | 2026-08-10T15:37:29+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 46
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 157
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_15-35-04_game-of-life-example-mapping_v3-basic-tdd_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_15-35-04_game-of-life-example-mapping_v3-basic-tdd_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (13 tests) 4ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  15:37:30
   Duration  157ms (transform 26ms, setup 0ms, collect 24ms, tests 4ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 11 | ×1 | 11 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 6 | ×5 | 30 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **187** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 33 |
| Functions | 4 |
| Longest Function | 22 lines |
| Avg LOC/Function | 9.25 |
| Median LOC/Function | 6.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 3.75 | 0 |
| Cognitive (SonarJS) | 9 | 8.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1834006 |
| Context Utilization | 27% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 5.80s |
| Avg Red Phase | 2.37s |
| Avg Green Phase | 3.43s |
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


