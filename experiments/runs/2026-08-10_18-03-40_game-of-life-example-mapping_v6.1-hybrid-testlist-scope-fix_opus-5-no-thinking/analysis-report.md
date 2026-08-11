# Analysis Report: 2026-08-10_18-03-40_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-10T18:13:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 562s |
| Started | 2026-08-10T18:03:40+00:00 |
| Ended | 2026-08-10T18:13:03+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 52
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 55
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_18-03-40_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_18-03-40_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 3ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  18:13:03
   Duration  155ms (transform 23ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 23 | ×1 | 23 |
| Invocations | 26 | ×2 | 52 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 5 | ×5 | 25 |
| Assignments | 14 | ×6 | 84 |
| **Total Mass** | | | **184** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 38 |
| Functions | 7 |
| Longest Function | 10 lines |
| Avg LOC/Function | 5.00 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 3 | 1.18 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6503338 |
| Context Utilization | 48% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 112.01s |
| Avg Red Phase | 20.75s |
| Avg Green Phase | 18.25s |
| Avg Refactor Phase | 73.01s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 18 |
| Predictions Total | 18 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


