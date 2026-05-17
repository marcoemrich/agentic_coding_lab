# Analysis Report: 2026-05-17_19-31-05_game-of-life-example-mapping_v8a-delayed-refactor-agent_opus-4-7-no-thinking

Generated: 2026-05-17T19:34:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v8a-delayed-refactor-agent |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 197s |
| Started | 2026-05-17T19:31:05+00:00 |
| Ended | 2026-05-17T19:34:23+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 38
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 207
- **Active tests**: 24
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (24 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-17_19-31-05_game-of-life-example-mapping_v8a-delayed-refactor-agent_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-17_19-31-05_game-of-life-example-mapping_v8a-delayed-refactor-agent_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (24 tests) 7ms

 Test Files  1 passed (1)
      Tests  24 passed (24)
   Start at  19:34:23
   Duration  166ms (transform 33ms, setup 0ms, collect 34ms, tests 7ms, environment 0ms, prepare 41ms)
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
| Invocations | 16 | ×2 | 32 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 4 | ×5 | 20 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **143** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 31 |
| Functions | 4 |
| Longest Function | 19 lines |
| Avg LOC/Function | 6.75 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 6 | 2.75 | 0 |
| Cognitive (SonarJS) | 7 | 4.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1165648 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 45.86s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 45.86s |

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


