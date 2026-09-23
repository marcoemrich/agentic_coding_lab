# Analysis Report: 2026-09-23_05-25-58_game-of-life-example-mapping_exact-subagents-v2-testlist-fix-cc_opus-5-no-thinking

Generated: 2026-09-23T05:38:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-subagents-v2-testlist-fix-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 740s |
| Started | 2026-09-23T05:25:58+00:00 |
| Ended | 2026-09-23T05:38:22+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 39
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 61
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_05-25-58_game-of-life-example-mapping_exact-subagents-v2-testlist-fix-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_05-25-58_game-of-life-example-mapping_exact-subagents-v2-testlist-fix-cc_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (11 tests) 6ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  05:38:23
   Duration  255ms (transform 42ms, setup 1ms, collect 43ms, tests 6ms, environment 0ms, prepare 69ms)
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
| Conditionals | 1 | ×4 | 4 |
| Loops | 2 | ×5 | 10 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **166** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 31 |
| Functions | 6 |
| Longest Function | 9 lines |
| Avg LOC/Function | 3.17 |
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
| McCabe (Cyclomatic) | 3 | 1.30 | 0 |
| Cognitive (SonarJS) | 2 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3437929 |
| Context Utilization | 42% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 98.68s |
| Avg Red Phase | 24.64s |
| Avg Green Phase | 32.05s |
| Avg Refactor Phase | 41.99s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 23 |
| Predictions Total | 24 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 9 |


