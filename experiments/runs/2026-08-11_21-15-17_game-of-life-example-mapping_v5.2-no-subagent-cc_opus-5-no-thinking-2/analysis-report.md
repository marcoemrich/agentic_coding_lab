# Analysis Report: 2026-08-11_21-15-17_game-of-life-example-mapping_v5.2-no-subagent-cc_opus-5-no-thinking-2

Generated: 2026-08-11T21:27:27+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.2-no-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 727s |
| Started | 2026-08-11T21:15:17+00:00 |
| Ended | 2026-08-11T21:27:27+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 71
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 115
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_21-15-17_game-of-life-example-mapping_v5.2-no-subagent-cc_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_21-15-17_game-of-life-example-mapping_v5.2-no-subagent-cc_opus-5-no-thinking-2

 ✓ src/game-of-life.spec.ts  (11 tests) 3ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  21:27:28
   Duration  173ms (transform 26ms, setup 0ms, collect 24ms, tests 3ms, environment 0ms, prepare 55ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 16 | ×1 | 16 |
| Invocations | 32 | ×2 | 64 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 4 | ×5 | 20 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **200** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 54 |
| Functions | 9 |
| Longest Function | 6 lines |
| Avg LOC/Function | 3.22 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 2 | 1.19 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 20237693 |
| Context Utilization | 88% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 85.35s |
| Avg Red Phase | 26.8s |
| Avg Green Phase | 15.27s |
| Avg Refactor Phase | 43.28s |

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
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


