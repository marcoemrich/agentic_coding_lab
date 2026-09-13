# Analysis Report: 2026-09-13_21-14-47_game-of-life-example-mapping_exact-hybrid-v2-testlist-fix-oc_opus-4-8-requesty

Generated: 2026-09-13T21:20:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | exact-hybrid-v2-testlist-fix-oc |
| Model | opus-4-8-requesty |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 367s |
| Started | 2026-09-13T21:14:48+00:00 |
| Ended | 2026-09-13T21:20:56+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 47
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 70
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-13_21-14-47_game-of-life-example-mapping_exact-hybrid-v2-testlist-fix-oc_opus-4-8-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-13_21-14-47_game-of-life-example-mapping_exact-hybrid-v2-testlist-fix-oc_opus-4-8-requesty

 ✓ src/game-of-life.spec.ts  (9 tests) 3ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  21:20:57
   Duration  167ms (transform 32ms, setup 0ms, collect 26ms, tests 3ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 9 | ×1 | 9 |
| Invocations | 21 | ×2 | 42 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 6 | ×5 | 30 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **165** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 40 |
| Functions | 3 |
| Longest Function | 28 lines |
| Avg LOC/Function | 13.67 |
| Median LOC/Function | 10.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 3.75 | 0 |
| Cognitive (SonarJS) | 12 | 9.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2029040 |
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
| Predictions Correct | 4 |
| Predictions Total | 4 |
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


