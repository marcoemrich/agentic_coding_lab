# Analysis Report: 2026-08-11_21-15-17_game-of-life-example-mapping_v5.2-no-subagent-cc_opus-5-no-thinking-3

Generated: 2026-08-11T21:30:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.2-no-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 936s |
| Started | 2026-08-11T21:15:17+00:00 |
| Ended | 2026-08-11T21:30:56+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 59
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 136
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_21-15-17_game-of-life-example-mapping_v5.2-no-subagent-cc_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_21-15-17_game-of-life-example-mapping_v5.2-no-subagent-cc_opus-5-no-thinking-3

 ✓ src/game-of-life.spec.ts  (10 tests) 3ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  21:30:56
   Duration  155ms (transform 28ms, setup 0ms, collect 24ms, tests 3ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 24 | ×1 | 24 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 7 | ×5 | 35 |
| Assignments | 17 | ×6 | 102 |
| **Total Mass** | | | **199** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 49 |
| Functions | 5 |
| Longest Function | 13 lines |
| Avg LOC/Function | 5.80 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 5 | 1.86 | 0 |
| Cognitive (SonarJS) | 5 | 3.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 28733215 |
| Context Utilization | 105% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 86.53s |
| Avg Red Phase | 25.51s |
| Avg Green Phase | 21.28s |
| Avg Refactor Phase | 39.74s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 10 |


