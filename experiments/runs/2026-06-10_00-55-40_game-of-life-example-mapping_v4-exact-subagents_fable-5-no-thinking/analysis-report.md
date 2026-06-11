# Analysis Report: 2026-06-10_00-55-40_game-of-life-example-mapping_v4-exact-subagents_fable-5-no-thinking

Generated: 2026-06-10T01:15:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4-exact-subagents |
| Model | fable-5-no-thinking |
| Model Version(s) | claude-fable-5 |
| Thinking | unknown |
| Duration | 1190s |
| Started | 2026-06-10T00:55:40+00:00 |
| Ended | 2026-06-10T01:15:31+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 32
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 74
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-06-10_00-55-40_game-of-life-example-mapping_v4-exact-subagents_fable-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-06-10_00-55-40_game-of-life-example-mapping_v4-exact-subagents_fable-5-no-thinking

 ✓ src/game-of-life.spec.ts  (8 tests) 4ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  01:15:32
   Duration  151ms (transform 22ms, setup 0ms, collect 19ms, tests 4ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 5 | ×1 | 5 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 3 | ×5 | 15 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **148** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 23 |
| Functions | 6 |
| Longest Function | 4 lines |
| Avg LOC/Function | 2.33 |
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
| McCabe (Cyclomatic) | 3 | 1.20 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1963846 |
| Context Utilization | 32% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 192.53s |
| Avg Red Phase | 46.56s |
| Avg Green Phase | 40.55s |
| Avg Refactor Phase | 105.42s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


