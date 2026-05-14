# Analysis Report: 2026-05-13_23-45-22_game-of-life-prose_v1-oneshot_opus-4-7-no-thinking

Generated: 2026-05-13T23:47:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-prose |
| Workflow | v1-oneshot |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 127s |
| Started | 2026-05-13T23:45:22+00:00 |
| Ended | 2026-05-13T23:47:30+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 61
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 164
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-13_23-45-22_game-of-life-prose_v1-oneshot_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-13_23-45-22_game-of-life-prose_v1-oneshot_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (16 tests) 4ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  23:47:31
   Duration  150ms (transform 26ms, setup 0ms, collect 25ms, tests 4ms, environment 0ms, prepare 40ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 23 | ×1 | 23 |
| Invocations | 24 | ×2 | 48 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 6 | ×5 | 30 |
| Assignments | 9 | ×6 | 54 |
| **Total Mass** | | | **159** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 51 |
| Functions | 4 |
| Longest Function | 24 lines |
| Avg LOC/Function | 9.50 |
| Median LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 9 | 3.25 | 0 |
| Cognitive (SonarJS) | 10 | 5.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1107207 |
| Context Utilization | 5% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 30.89s |
| Avg Red Phase | 30.89s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | N/A |
| Predictions Total | N/A |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


