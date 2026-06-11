# Analysis Report: 2026-06-09_22-57-45_game-of-life-example-mapping_v4-exact-subagents_fable-5-no-thinking

Generated: 2026-06-09T23:14:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4-exact-subagents |
| Model | fable-5-no-thinking |
| Model Version(s) | claude-fable-5 |
| Thinking | unknown |
| Duration | 975s |
| Started | 2026-06-09T22:57:45+00:00 |
| Ended | 2026-06-09T23:14:01+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 47
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 82
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-06-09_22-57-45_game-of-life-example-mapping_v4-exact-subagents_fable-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-06-09_22-57-45_game-of-life-example-mapping_v4-exact-subagents_fable-5-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 5ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  23:14:02
   Duration  162ms (transform 24ms, setup 0ms, collect 22ms, tests 5ms, environment 0ms, prepare 45ms)
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
| Invocations | 20 | ×2 | 40 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 1 | ×5 | 5 |
| Assignments | 19 | ×6 | 114 |
| **Total Mass** | | | **183** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 39 |
| Functions | 7 |
| Longest Function | 9 lines |
| Avg LOC/Function | 4.00 |
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
| Total Tokens | 2526529 |
| Context Utilization | 36% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 138.83s |
| Avg Red Phase | 34.15s |
| Avg Green Phase | 26.46s |
| Avg Refactor Phase | 78.22s |

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
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


