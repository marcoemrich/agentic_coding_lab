# Analysis Report: 2026-08-11_05-07-07_game-of-life-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T05:17:10+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 602s |
| Started | 2026-08-11T05:07:07+00:00 |
| Ended | 2026-08-11T05:17:10+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 48
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 152
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_05-07-07_game-of-life-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_05-07-07_game-of-life-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (11 tests) 4ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  05:17:10
   Duration  168ms (transform 27ms, setup 0ms, collect 25ms, tests 4ms, environment 0ms, prepare 49ms)
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
| Invocations | 19 | ×2 | 38 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 3 | ×5 | 15 |
| Assignments | 19 | ×6 | 114 |
| **Total Mass** | | | **188** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 38 |
| Functions | 6 |
| Longest Function | 8 lines |
| Avg LOC/Function | 3.83 |
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
| McCabe (Cyclomatic) | 2 | 1.10 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8780237 |
| Context Utilization | 53% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 94.63s |
| Avg Red Phase | 20.03s |
| Avg Green Phase | 17.59s |
| Avg Refactor Phase | 57.01s |

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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 9 |


