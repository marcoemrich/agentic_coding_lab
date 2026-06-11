# Analysis Report: 2026-06-09_23-53-17_game-of-life-example-mapping_v4-exact-subagents_fable-5

Generated: 2026-06-10T00:15:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4-exact-subagents |
| Model | fable-5 |
| Model Version(s) | claude-fable-5 |
| Thinking | true |
| Duration | 1344s |
| Started | 2026-06-09T23:53:17+00:00 |
| Ended | 2026-06-10T00:15:42+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 40
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 77
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (7 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-06-09_23-53-17_game-of-life-example-mapping_v4-exact-subagents_fable-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-06-09_23-53-17_game-of-life-example-mapping_v4-exact-subagents_fable-5

 ✓ src/game-of-life.spec.ts  (7 tests) 4ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  00:15:43
   Duration  162ms (transform 24ms, setup 0ms, collect 22ms, tests 4ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 15 | ×1 | 15 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 1 | ×5 | 5 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **148** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 32 |
| Functions | 8 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 2 | 1.15 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2701739 |
| Context Utilization | 40% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 148.81s |
| Avg Red Phase | 38.74s |
| Avg Green Phase | 34.29s |
| Avg Refactor Phase | 75.78s |

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
| Tests Passed Immediately | 4 |


