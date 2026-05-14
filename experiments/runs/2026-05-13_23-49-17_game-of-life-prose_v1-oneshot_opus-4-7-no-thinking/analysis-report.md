# Analysis Report: 2026-05-13_23-49-17_game-of-life-prose_v1-oneshot_opus-4-7-no-thinking

Generated: 2026-05-13T23:51:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-prose |
| Workflow | v1-oneshot |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 103s |
| Started | 2026-05-13T23:49:17+00:00 |
| Ended | 2026-05-13T23:51:01+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 65
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 166
- **Active tests**: 20
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (20 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-13_23-49-17_game-of-life-prose_v1-oneshot_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-13_23-49-17_game-of-life-prose_v1-oneshot_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (20 tests) 4ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  23:51:01
   Duration  164ms (transform 31ms, setup 0ms, collect 30ms, tests 4ms, environment 0ms, prepare 42ms)
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
| Invocations | 32 | ×2 | 64 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 5 | ×5 | 25 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **210** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 55 |
| Functions | 6 |
| Longest Function | 21 lines |
| Avg LOC/Function | 8.17 |
| Median LOC/Function | 6.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 1 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.50 | 0 |
| Cognitive (SonarJS) | 9 | 3.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1147997 |
| Context Utilization | 5% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 6.52s |
| Avg Red Phase | 6.52s |
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
| Tests Passed Immediately | 1 |


