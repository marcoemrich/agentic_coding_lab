# Analysis Report: 2026-07-25_19-40-01_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty

Generated: 2026-07-25T19:51:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-8-requesty |
| Model Version(s) | claude-opus-4-8 |
| Thinking | true |
| Duration | 661s |
| Started | 2026-07-25T19:40:01+00:00 |
| Ended | 2026-07-25T19:51:03+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 45
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 43
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_19-40-01_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_19-40-01_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty

 ✓ src/game-of-life.spec.ts  (8 tests) 4ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  19:51:04
   Duration  167ms (transform 25ms, setup 0ms, collect 24ms, tests 4ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 22 | ×1 | 22 |
| Invocations | 18 | ×2 | 36 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 5 | ×5 | 25 |
| Assignments | 14 | ×6 | 84 |
| **Total Mass** | | | **171** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 38 |
| Functions | 5 |
| Longest Function | 12 lines |
| Avg LOC/Function | 5.80 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 2.20 | 0 |
| Cognitive (SonarJS) | 4 | 2.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3434019 |
| Context Utilization | 45% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 92.34s |
| Avg Red Phase | 25.76s |
| Avg Green Phase | 21.43s |
| Avg Refactor Phase | 45.15s |

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
| Tests Passed Immediately | 5 |


