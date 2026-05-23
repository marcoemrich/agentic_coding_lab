# Analysis Report: 2026-05-23_13-58-28_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-no-thinking

Generated: 2026-05-23T14:10:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 727s |
| Started | 2026-05-23T13:58:28+00:00 |
| Ended | 2026-05-23T14:10:36+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 27
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 84
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_13-58-28_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_13-58-28_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-4-7-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 8ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  14:10:37
   Duration  155ms (transform 24ms, setup 1ms, collect 22ms, tests 8ms, environment 0ms, prepare 42ms)
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
| Invocations | 17 | ×2 | 34 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 3 | ×5 | 15 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **144** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 21 |
| Functions | 6 |
| Longest Function | 2 lines |
| Avg LOC/Function | 1.83 |
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
| McCabe (Cyclomatic) | 3 | 1.20 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9796559 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 104.67s |
| Avg Red Phase | 27.91s |
| Avg Green Phase | 20.97s |
| Avg Refactor Phase | 55.79s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 17 |
| Predictions Total | 17 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


