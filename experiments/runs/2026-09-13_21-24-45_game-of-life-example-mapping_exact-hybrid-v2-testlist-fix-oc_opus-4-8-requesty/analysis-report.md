# Analysis Report: 2026-09-13_21-24-45_game-of-life-example-mapping_exact-hybrid-v2-testlist-fix-oc_opus-4-8-requesty

Generated: 2026-09-13T21:31:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-hybrid-v2-testlist-fix-oc |
| Model | opus-4-8-requesty |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 419s |
| Started | 2026-09-13T21:24:45+00:00 |
| Ended | 2026-09-13T21:31:45+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 35
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 59
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-13_21-24-45_game-of-life-example-mapping_exact-hybrid-v2-testlist-fix-oc_opus-4-8-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-13_21-24-45_game-of-life-example-mapping_exact-hybrid-v2-testlist-fix-oc_opus-4-8-requesty

 ✓ src/game-of-life.spec.ts  (8 tests) 5ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  21:31:46
   Duration  269ms (transform 42ms, setup 0ms, collect 45ms, tests 5ms, environment 0ms, prepare 54ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 11 | ×1 | 11 |
| Invocations | 21 | ×2 | 42 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 6 | ×5 | 30 |
| Assignments | 9 | ×6 | 54 |
| **Total Mass** | | | **149** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 26 |
| Functions | 3 |
| Longest Function | 24 lines |
| Avg LOC/Function | 9.67 |
| Median LOC/Function | 3.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 3.50 | 0 |
| Cognitive (SonarJS) | 15 | 8.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2386644 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


