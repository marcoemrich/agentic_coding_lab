# Analysis Report: 2026-05-26_09-54-55_game-of-life-example-mapping_v6.2.1-refactor-vocab_opus-4-7-portkey-no-thinking

Generated: 2026-05-26T10:07:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.2.1-refactor-vocab |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 779s |
| Started | 2026-05-26T09:54:55+00:00 |
| Ended | 2026-05-26T10:07:56+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 52
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 47
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_09-54-55_game-of-life-example-mapping_v6.2.1-refactor-vocab_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_09-54-55_game-of-life-example-mapping_v6.2.1-refactor-vocab_opus-4-7-portkey-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 15ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  10:07:57
   Duration  228ms (transform 37ms, setup 0ms, collect 36ms, tests 15ms, environment 0ms, prepare 65ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 19 | ×1 | 19 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 4 | ×5 | 20 |
| Assignments | 20 | ×6 | 120 |
| **Total Mass** | | | **207** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 40 |
| Functions | 8 |
| Longest Function | 4 lines |
| Avg LOC/Function | 2.25 |
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
| McCabe (Cyclomatic) | 4 | 1.36 | 0 |
| Cognitive (SonarJS) | 6 | 3.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10716143 |
| Context Utilization | 12% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 75.94s |
| Avg Red Phase | 17.51s |
| Avg Green Phase | 9.1s |
| Avg Refactor Phase | 49.33s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 19 |
| Predictions Total | 20 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


