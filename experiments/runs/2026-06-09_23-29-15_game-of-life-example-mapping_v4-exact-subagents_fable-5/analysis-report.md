# Analysis Report: 2026-06-09_23-29-15_game-of-life-example-mapping_v4-exact-subagents_fable-5

Generated: 2026-06-09T23:53:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4-exact-subagents |
| Model | fable-5 |
| Model Version(s) | claude-fable-5 |
| Thinking | true |
| Duration | 1425s |
| Started | 2026-06-09T23:29:15+00:00 |
| Ended | 2026-06-09T23:53:01+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 38
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 43
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (7 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-06-09_23-29-15_game-of-life-example-mapping_v4-exact-subagents_fable-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-06-09_23-29-15_game-of-life-example-mapping_v4-exact-subagents_fable-5

 ✓ src/game-of-life.spec.ts  (7 tests) 4ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  23:53:01
   Duration  156ms (transform 23ms, setup 0ms, collect 21ms, tests 4ms, environment 0ms, prepare 43ms)
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
| Invocations | 18 | ×2 | 36 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 1 | ×5 | 5 |
| Assignments | 18 | ×6 | 108 |
| **Total Mass** | | | **169** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 29 |
| Functions | 8 |
| Longest Function | 6 lines |
| Avg LOC/Function | 2.75 |
| Median LOC/Function | 2.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 2 | 1.21 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3147340 |
| Context Utilization | 40% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 153.60s |
| Avg Red Phase | 39.16s |
| Avg Green Phase | 37.76s |
| Avg Refactor Phase | 76.68s |

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
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


