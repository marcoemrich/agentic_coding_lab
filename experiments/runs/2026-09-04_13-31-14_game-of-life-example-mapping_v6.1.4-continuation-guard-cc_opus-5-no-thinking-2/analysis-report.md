# Analysis Report: 2026-09-04_13-31-14_game-of-life-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking-2

Generated: 2026-09-04T13:41:17+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1.4-continuation-guard-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 601s |
| Started | 2026-09-04T13:31:14+00:00 |
| Ended | 2026-09-04T13:41:17+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 49
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 144
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_13-31-14_game-of-life-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_13-31-14_game-of-life-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking-2

 ✓ src/game-of-life.spec.ts  (12 tests) 11ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  13:41:18
   Duration  287ms (transform 46ms, setup 0ms, collect 45ms, tests 11ms, environment 0ms, prepare 79ms)
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
| Invocations | 25 | ×2 | 50 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 1 | ×5 | 5 |
| Assignments | 8 | ×6 | 48 |
| **Total Mass** | | | **122** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 40 |
| Functions | 8 |
| Longest Function | 7 lines |
| Avg LOC/Function | 3.62 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.23 | 0 |
| Cognitive (SonarJS) | 2 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9795582 |
| Context Utilization | 57% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 88.99s |
| Avg Red Phase | 19.26s |
| Avg Green Phase | 14.58s |
| Avg Refactor Phase | 55.15s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 24 |
| Predictions Total | 24 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 8 |


