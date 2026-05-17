# Analysis Report: 2026-05-17_03-22-08_game-of-life-example-mapping_v6.6-leaner_opus-4-7-no-thinking

Generated: 2026-05-17T03:32:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.6-leaner |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 607s |
| Started | 2026-05-17T03:22:08+00:00 |
| Ended | 2026-05-17T03:32:16+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 44
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 40
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (6 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-17_03-22-08_game-of-life-example-mapping_v6.6-leaner_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-17_03-22-08_game-of-life-example-mapping_v6.6-leaner_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (6 tests) 3ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  03:32:16
   Duration  149ms (transform 23ms, setup 0ms, collect 21ms, tests 3ms, environment 0ms, prepare 42ms)
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
| Invocations | 18 | ×2 | 36 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 4 | ×5 | 20 |
| Assignments | 14 | ×6 | 84 |
| **Total Mass** | | | **169** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 37 |
| Functions | 5 |
| Longest Function | 11 lines |
| Avg LOC/Function | 5.40 |
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
| McCabe (Cyclomatic) | 3 | 1.86 | 0 |
| Cognitive (SonarJS) | 3 | 2.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5917368 |
| Context Utilization | 9% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 96.92s |
| Avg Red Phase | 23.24s |
| Avg Green Phase | 18.22s |
| Avg Refactor Phase | 55.46s |

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
| Tests Passed Immediately | 1 |


