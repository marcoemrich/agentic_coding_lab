# Analysis Report: 2026-05-30_12-04-18_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-7-no-thinking

Generated: 2026-05-30T12:18:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 853s |
| Started | 2026-05-30T12:04:18+00:00 |
| Ended | 2026-05-30T12:18:32+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 39
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 52
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-30_12-04-18_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-30_12-04-18_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 4ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  12:18:32
   Duration  152ms (transform 23ms, setup 0ms, collect 22ms, tests 4ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 26 | ×1 | 26 |
| Invocations | 15 | ×2 | 30 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 5 | ×5 | 25 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **141** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 31 |
| Functions | 4 |
| Longest Function | 15 lines |
| Avg LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 4 | 1.83 | 0 |
| Cognitive (SonarJS) | 4 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10593450 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 89.89s |
| Avg Red Phase | 22.09s |
| Avg Green Phase | 11.39s |
| Avg Refactor Phase | 56.41s |

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
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


