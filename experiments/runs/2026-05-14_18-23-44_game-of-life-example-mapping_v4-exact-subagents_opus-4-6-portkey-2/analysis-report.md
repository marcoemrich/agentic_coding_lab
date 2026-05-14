# Analysis Report: 2026-05-14_18-23-44_game-of-life-example-mapping_v4-exact-subagents_opus-4-6-portkey-2

Generated: 2026-05-14T18:38:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 903s |
| Started | 2026-05-14T18:23:44+00:00 |
| Ended | 2026-05-14T18:38:49+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 25
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 43
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (6 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-14_18-23-44_game-of-life-example-mapping_v4-exact-subagents_opus-4-6-portkey-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-14_18-23-44_game-of-life-example-mapping_v4-exact-subagents_opus-4-6-portkey-2

 ✓ src/game-of-life.spec.ts  (6 tests) 4ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  18:38:49
   Duration  151ms (transform 23ms, setup 0ms, collect 21ms, tests 4ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 11 | ×1 | 11 |
| Invocations | 17 | ×2 | 34 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 6 | ×5 | 30 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **139** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 20 |
| Functions | 3 |
| Longest Function | 18 lines |
| Avg LOC/Function | 7.33 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 7 | 2.33 | 0 |
| Cognitive (SonarJS) | 12 | 7.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2825495 |
| Context Utilization | 28% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 129.50s |
| Avg Red Phase | 38.09s |
| Avg Green Phase | 31.63s |
| Avg Refactor Phase | 59.78s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 12 |
| Predictions Total | 12 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


