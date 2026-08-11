# Analysis Report: 2026-08-10_23-43-04_game-of-life-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T00:06:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1408s |
| Started | 2026-08-10T23:43:04+00:00 |
| Ended | 2026-08-11T00:06:34+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 76
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 161
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_23-43-04_game-of-life-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_23-43-04_game-of-life-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 6ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  00:06:35
   Duration  206ms (transform 29ms, setup 0ms, collect 26ms, tests 6ms, environment 0ms, prepare 55ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 8 | ×1 | 8 |
| Invocations | 40 | ×2 | 80 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 1 | ×5 | 5 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **171** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 59 |
| Functions | 11 |
| Longest Function | 9 lines |
| Avg LOC/Function | 5.09 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 3 | 1.37 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17027650 |
| Context Utilization | 84% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 113.66s |
| Avg Red Phase | 30.03s |
| Avg Green Phase | 25.73s |
| Avg Refactor Phase | 57.9s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 22 |
| Predictions Total | 22 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


