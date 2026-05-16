# Analysis Report: 2026-05-16_08-27-17_game-of-life-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking

Generated: 2026-05-16T08:34:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 403s |
| Started | 2026-05-16T08:27:17+00:00 |
| Ended | 2026-05-16T08:34:01+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 36
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 54
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (7 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_08-27-17_game-of-life-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_08-27-17_game-of-life-example-mapping_v6.4-no-emoji_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (7 tests) 3ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  08:34:01
   Duration  149ms (transform 23ms, setup 0ms, collect 21ms, tests 3ms, environment 0ms, prepare 41ms)
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
| Invocations | 16 | ×2 | 32 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 4 | ×5 | 20 |
| Assignments | 14 | ×6 | 84 |
| **Total Mass** | | | **169** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 31 |
| Functions | 4 |
| Longest Function | 13 lines |
| Avg LOC/Function | 6.50 |
| Median LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 4 | 2.75 | 0 |
| Cognitive (SonarJS) | 7 | 4.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4689099 |
| Context Utilization | 8% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 100.33s |
| Avg Red Phase | 32.3s |
| Avg Green Phase | 18.8s |
| Avg Refactor Phase | 49.23s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 14 |
| Predictions Total | 14 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


