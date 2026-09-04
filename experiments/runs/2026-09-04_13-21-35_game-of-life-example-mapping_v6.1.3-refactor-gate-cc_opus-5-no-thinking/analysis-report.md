# Analysis Report: 2026-09-04_13-21-35_game-of-life-example-mapping_v6.1.3-refactor-gate-cc_opus-5-no-thinking

Generated: 2026-09-04T13:29:27+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1.3-refactor-gate-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 470s |
| Started | 2026-09-04T13:21:35+00:00 |
| Ended | 2026-09-04T13:29:27+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 45
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 44
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_13-21-35_game-of-life-example-mapping_v6.1.3-refactor-gate-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_13-21-35_game-of-life-example-mapping_v6.1.3-refactor-gate-cc_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 6ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  13:29:28
   Duration  306ms (transform 45ms, setup 0ms, collect 43ms, tests 6ms, environment 0ms, prepare 104ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 22 | ×1 | 22 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 4 | ×5 | 20 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **184** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 32 |
| Functions | 7 |
| Longest Function | 2 lines |
| Avg LOC/Function | 2.00 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 5 | 1.56 | 0 |
| Cognitive (SonarJS) | 9 | 5.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8000043 |
| Context Utilization | 51% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 121.27s |
| Avg Red Phase | 22.82s |
| Avg Green Phase | 17.73s |
| Avg Refactor Phase | 80.72s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 20 |
| Predictions Total | 20 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


