# Analysis Report: 2026-08-10_15-40-11_game-of-life-example-mapping_v3-basic-tdd_opus-5-no-thinking

Generated: 2026-08-10T15:42:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 148s |
| Started | 2026-08-10T15:40:11+00:00 |
| Ended | 2026-08-10T15:42:40+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 55
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 75
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_15-40-11_game-of-life-example-mapping_v3-basic-tdd_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_15-40-11_game-of-life-example-mapping_v3-basic-tdd_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 4ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  15:42:40
   Duration  154ms (transform 25ms, setup 0ms, collect 23ms, tests 4ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 17 | ×1 | 17 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 5 | ×5 | 25 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **166** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 44 |
| Functions | 5 |
| Longest Function | 9 lines |
| Avg LOC/Function | 4.40 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 4 | 1.71 | 0 |
| Cognitive (SonarJS) | 7 | 4.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1984611 |
| Context Utilization | 26% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 11.91s |
| Avg Red Phase | 4.13s |
| Avg Green Phase | 2.58s |
| Avg Refactor Phase | 5.2s |

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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


