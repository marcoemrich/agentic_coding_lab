# Analysis Report: 2026-05-26_01-08-22_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey

Generated: 2026-05-26T01:21:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-7-portkey |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 808s |
| Started | 2026-05-26T01:08:22+00:00 |
| Ended | 2026-05-26T01:21:53+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 38
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 50
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_01-08-22_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_01-08-22_game-of-life-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey

 ✓ src/game-of-life.spec.ts  (10 tests) 7ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  01:21:54
   Duration  350ms (transform 54ms, setup 0ms, collect 53ms, tests 7ms, environment 0ms, prepare 100ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 20 | ×1 | 20 |
| Invocations | 15 | ×2 | 30 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 5 | ×5 | 25 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **151** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 30 |
| Functions | 4 |
| Longest Function | 2 lines |
| Avg LOC/Function | 2.00 |
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
| Cognitive (SonarJS) | 3 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10334606 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 77.99s |
| Avg Red Phase | 23.86s |
| Avg Green Phase | 12.71s |
| Avg Refactor Phase | 41.42s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 20 |
| Predictions Total | 20 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


