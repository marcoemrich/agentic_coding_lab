# Analysis Report: 2026-05-26_02-06-27_game-of-life-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey

Generated: 2026-05-26T02:18:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.2-with-why-cleaned-oc |
| Model | opus-4-7-portkey |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 734s |
| Started | 2026-05-26T02:06:27+00:00 |
| Ended | 2026-05-26T02:18:43+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 37
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 64
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_02-06-27_game-of-life-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_02-06-27_game-of-life-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey

 ✓ src/game-of-life.spec.ts  (9 tests) 6ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  02:18:44
   Duration  329ms (transform 44ms, setup 0ms, collect 45ms, tests 6ms, environment 0ms, prepare 93ms)
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
| Conditionals | 0 | ×4 | 0 |
| Loops | 3 | ×5 | 15 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **161** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 26 |
| Functions | 7 |
| Longest Function | 5 lines |
| Avg LOC/Function | 2.29 |
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
| McCabe (Cyclomatic) | 3 | 1.20 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3007657 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


