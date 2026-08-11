# Analysis Report: 2026-08-11_00-28-36_game-of-life-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking

Generated: 2026-08-11T00:47:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1109s |
| Started | 2026-08-11T00:28:36+00:00 |
| Ended | 2026-08-11T00:47:06+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 43
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 56
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_00-28-36_game-of-life-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_00-28-36_game-of-life-example-mapping_v6.6-lab-split-cc_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 4ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  00:47:07
   Duration  166ms (transform 23ms, setup 0ms, collect 22ms, tests 4ms, environment 0ms, prepare 49ms)
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
| Invocations | 17 | ×2 | 34 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 4 | ×5 | 20 |
| Assignments | 14 | ×6 | 84 |
| **Total Mass** | | | **158** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 34 |
| Functions | 5 |
| Longest Function | 9 lines |
| Avg LOC/Function | 5.20 |
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
| McCabe (Cyclomatic) | 3 | 1.86 | 0 |
| Cognitive (SonarJS) | 3 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11325769 |
| Context Utilization | 14% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 94.05s |
| Avg Red Phase | 27.54s |
| Avg Green Phase | 9.8s |
| Avg Refactor Phase | 56.71s |

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


