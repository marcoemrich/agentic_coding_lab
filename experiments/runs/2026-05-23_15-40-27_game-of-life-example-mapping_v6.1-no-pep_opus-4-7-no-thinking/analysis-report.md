# Analysis Report: 2026-05-23_15-40-27_game-of-life-example-mapping_v6.1-no-pep_opus-4-7-no-thinking

Generated: 2026-05-23T15:55:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1-no-pep |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 908s |
| Started | 2026-05-23T15:40:27+00:00 |
| Ended | 2026-05-23T15:55:36+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 29
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 48
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_15-40-27_game-of-life-example-mapping_v6.1-no-pep_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_15-40-27_game-of-life-example-mapping_v6.1-no-pep_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 4ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  15:55:36
   Duration  149ms (transform 23ms, setup 0ms, collect 21ms, tests 4ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 18 | ×1 | 18 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 3 | ×5 | 15 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **149** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 21 |
| Functions | 7 |
| Longest Function | 2 lines |
| Avg LOC/Function | 1.86 |
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
| McCabe (Cyclomatic) | 3 | 1.18 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9869254 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 96.32s |
| Avg Red Phase | 22.16s |
| Avg Green Phase | 11.94s |
| Avg Refactor Phase | 62.22s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 10 |
| Predictions Total | 10 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


