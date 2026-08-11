# Analysis Report: 2026-08-10_15-36-42_game-of-life-example-mapping_v3-basic-tdd_opus-5-no-thinking

Generated: 2026-08-10T15:39:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 192s |
| Started | 2026-08-10T15:36:42+00:00 |
| Ended | 2026-08-10T15:39:55+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 55
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 134
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (17 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_15-36-42_game-of-life-example-mapping_v3-basic-tdd_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_15-36-42_game-of-life-example-mapping_v3-basic-tdd_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (17 tests) 5ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  15:39:56
   Duration  170ms (transform 28ms, setup 0ms, collect 27ms, tests 5ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 7 | ×5 | 35 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **194** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 43 |
| Functions | 5 |
| Longest Function | 16 lines |
| Avg LOC/Function | 6.80 |
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
| McCabe (Cyclomatic) | 5 | 2.17 | 0 |
| Cognitive (SonarJS) | 5 | 4.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2124169 |
| Context Utilization | 28% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 9.62s |
| Avg Red Phase | 4.62s |
| Avg Green Phase | 5s |
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
| Tests Passed Immediately | 1 |


