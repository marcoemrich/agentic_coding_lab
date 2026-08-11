# Analysis Report: 2026-08-10_15-36-02_game-of-life-example-mapping_v3-basic-tdd_opus-5-no-thinking

Generated: 2026-08-10T15:38:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 159s |
| Started | 2026-08-10T15:36:02+00:00 |
| Ended | 2026-08-10T15:38:43+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 62
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 119
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_15-36-02_game-of-life-example-mapping_v3-basic-tdd_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_15-36-02_game-of-life-example-mapping_v3-basic-tdd_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (15 tests) 4ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  15:38:44
   Duration  175ms (transform 30ms, setup 0ms, collect 28ms, tests 4ms, environment 0ms, prepare 48ms)
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
| Invocations | 26 | ×2 | 52 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 7 | ×5 | 35 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **206** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 46 |
| Functions | 4 |
| Longest Function | 17 lines |
| Avg LOC/Function | 8.75 |
| Median LOC/Function | 8.00 |
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
| McCabe (Cyclomatic) | 7 | 3.60 | 0 |
| Cognitive (SonarJS) | 7 | 5.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1990099 |
| Context Utilization | 28% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 9.42s |
| Avg Red Phase | 5.71s |
| Avg Green Phase | 3.71s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


