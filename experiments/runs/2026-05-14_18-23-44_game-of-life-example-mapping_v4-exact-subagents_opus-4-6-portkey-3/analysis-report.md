# Analysis Report: 2026-05-14_18-23-44_game-of-life-example-mapping_v4-exact-subagents_opus-4-6-portkey-3

Generated: 2026-05-14T18:38:12+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 866s |
| Started | 2026-05-14T18:23:44+00:00 |
| Ended | 2026-05-14T18:38:12+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 40
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 27
- **Active tests**: 5
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (5 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-14_18-23-44_game-of-life-example-mapping_v4-exact-subagents_opus-4-6-portkey-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-14_18-23-44_game-of-life-example-mapping_v4-exact-subagents_opus-4-6-portkey-3

 ✓ src/game-of-life.spec.ts  (5 tests) 4ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  18:38:12
   Duration  147ms (transform 22ms, setup 0ms, collect 20ms, tests 4ms, environment 0ms, prepare 42ms)
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
| Invocations | 23 | ×2 | 46 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 7 | ×5 | 35 |
| Assignments | 14 | ×6 | 84 |
| **Total Mass** | | | **187** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 34 |
| Functions | 3 |
| Longest Function | 26 lines |
| Avg LOC/Function | 12.67 |
| Median LOC/Function | 10.00 |
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
| McCabe (Cyclomatic) | 6 | 2.67 | 0 |
| Cognitive (SonarJS) | 9 | 5.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2759447 |
| Context Utilization | 27% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 129.40s |
| Avg Red Phase | 37.43s |
| Avg Green Phase | 34.28s |
| Avg Refactor Phase | 57.69s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 11 |
| Predictions Total | 11 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


