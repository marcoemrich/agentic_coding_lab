# Analysis Report: 2026-05-17_18-57-02_game-of-life-example-mapping_v8a-delayed-refactor-agent_opus-4-7-no-thinking

Generated: 2026-05-17T18:59:35+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v8a-delayed-refactor-agent |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 151s |
| Started | 2026-05-17T18:57:02+00:00 |
| Ended | 2026-05-17T18:59:34+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 36
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 182
- **Active tests**: 20
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (20 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-17_18-57-02_game-of-life-example-mapping_v8a-delayed-refactor-agent_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-17_18-57-02_game-of-life-example-mapping_v8a-delayed-refactor-agent_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (20 tests) 5ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  18:59:35
   Duration  170ms (transform 33ms, setup 0ms, collect 28ms, tests 5ms, environment 0ms, prepare 48ms)
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
| Invocations | 15 | ×2 | 30 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 4 | ×5 | 20 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **145** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 30 |
| Functions | 3 |
| Longest Function | 17 lines |
| Avg LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 6 | 2.75 | 0 |
| Cognitive (SonarJS) | 10 | 6.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 912639 |
| Context Utilization | 5% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 65.15s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 65.15s |

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


