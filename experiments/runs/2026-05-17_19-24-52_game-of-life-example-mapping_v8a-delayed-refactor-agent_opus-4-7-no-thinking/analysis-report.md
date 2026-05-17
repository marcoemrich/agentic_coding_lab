# Analysis Report: 2026-05-17_19-24-52_game-of-life-example-mapping_v8a-delayed-refactor-agent_opus-4-7-no-thinking

Generated: 2026-05-17T19:27:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v8a-delayed-refactor-agent |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 167s |
| Started | 2026-05-17T19:24:52+00:00 |
| Ended | 2026-05-17T19:27:40+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 33
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 174
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (18 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-17_19-24-52_game-of-life-example-mapping_v8a-delayed-refactor-agent_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-17_19-24-52_game-of-life-example-mapping_v8a-delayed-refactor-agent_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (18 tests) 5ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  19:27:40
   Duration  164ms (transform 27ms, setup 0ms, collect 26ms, tests 5ms, environment 0ms, prepare 49ms)
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
| Invocations | 18 | ×2 | 36 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 4 | ×5 | 20 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **143** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 28 |
| Functions | 4 |
| Longest Function | 10 lines |
| Avg LOC/Function | 5.75 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 4 | 1.83 | 0 |
| Cognitive (SonarJS) | 4 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 823625 |
| Context Utilization | 5% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 61.06s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 61.06s |

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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


