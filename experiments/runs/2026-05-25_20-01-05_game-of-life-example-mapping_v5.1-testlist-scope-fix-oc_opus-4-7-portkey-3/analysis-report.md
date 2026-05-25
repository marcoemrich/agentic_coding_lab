# Analysis Report: 2026-05-25_20-01-05_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_opus-4-7-portkey-3

Generated: 2026-05-25T20:05:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | opus-4-7-portkey |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 240s |
| Started | 2026-05-25T20:01:05+00:00 |
| Ended | 2026-05-25T20:05:06+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 44
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 71
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_20-01-05_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_opus-4-7-portkey-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_20-01-05_game-of-life-example-mapping_v5.1-testlist-scope-fix-oc_opus-4-7-portkey-3

 ✓ src/game-of-life.spec.ts  (9 tests) 6ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  20:05:07
   Duration  177ms (transform 27ms, setup 0ms, collect 25ms, tests 6ms, environment 0ms, prepare 49ms)
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
| Invocations | 21 | ×2 | 42 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 3 | ×5 | 15 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **182** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 36 |
| Functions | 6 |
| Longest Function | 17 lines |
| Avg LOC/Function | 5.00 |
| Median LOC/Function | 2.50 |
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
| McCabe (Cyclomatic) | 4 | 1.56 | 0 |
| Cognitive (SonarJS) | 6 | 4.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1645844 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 5 |
| Predictions Total | 5 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


