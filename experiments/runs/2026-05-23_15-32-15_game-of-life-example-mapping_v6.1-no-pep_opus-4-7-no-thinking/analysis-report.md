# Analysis Report: 2026-05-23_15-32-15_game-of-life-example-mapping_v6.1-no-pep_opus-4-7-no-thinking

Generated: 2026-05-23T15:40:10+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1-no-pep |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 474s |
| Started | 2026-05-23T15:32:15+00:00 |
| Ended | 2026-05-23T15:40:10+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 38
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 51
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_15-32-15_game-of-life-example-mapping_v6.1-no-pep_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_15-32-15_game-of-life-example-mapping_v6.1-no-pep_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 3ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  15:40:11
   Duration  153ms (transform 25ms, setup 0ms, collect 23ms, tests 3ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 20 | ×1 | 20 |
| Invocations | 13 | ×2 | 26 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 4 | ×5 | 20 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **130** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 31 |
| Functions | 3 |
| Longest Function | 25 lines |
| Avg LOC/Function | 9.67 |
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
| McCabe (Cyclomatic) | 7 | 3.67 | 0 |
| Cognitive (SonarJS) | 7 | 4.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5934545 |
| Context Utilization | 9% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 105.89s |
| Avg Red Phase | 27.46s |
| Avg Green Phase | 17.36s |
| Avg Refactor Phase | 61.07s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 15 |
| Predictions Total | 15 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


