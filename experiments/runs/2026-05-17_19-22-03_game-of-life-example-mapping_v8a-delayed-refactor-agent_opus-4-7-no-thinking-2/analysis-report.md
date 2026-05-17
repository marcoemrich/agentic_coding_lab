# Analysis Report: 2026-05-17_19-22-03_game-of-life-example-mapping_v8a-delayed-refactor-agent_opus-4-7-no-thinking-2

Generated: 2026-05-17T19:25:37+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v8a-delayed-refactor-agent |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 213s |
| Started | 2026-05-17T19:22:03+00:00 |
| Ended | 2026-05-17T19:25:37+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 30
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 203
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-17_19-22-03_game-of-life-example-mapping_v8a-delayed-refactor-agent_opus-4-7-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-17_19-22-03_game-of-life-example-mapping_v8a-delayed-refactor-agent_opus-4-7-no-thinking-2

 ✓ src/game-of-life.spec.ts  (16 tests) 4ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  19:25:38
   Duration  166ms (transform 26ms, setup 0ms, collect 25ms, tests 4ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 10 | ×1 | 10 |
| Invocations | 15 | ×2 | 30 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 5 | ×5 | 25 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **133** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 25 |
| Functions | 2 |
| Longest Function | 26 lines |
| Avg LOC/Function | 14.00 |
| Median LOC/Function | 14.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 6.00 | 1 |
| Cognitive (SonarJS) | 17 | 17.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1095258 |
| Context Utilization | 5% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 104.23s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 104.23s |

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


