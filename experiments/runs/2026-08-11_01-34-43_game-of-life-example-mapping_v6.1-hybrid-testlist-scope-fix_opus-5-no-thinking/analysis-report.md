# Analysis Report: 2026-08-11_01-34-43_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-11T01:43:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 509s |
| Started | 2026-08-11T01:34:43+00:00 |
| Ended | 2026-08-11T01:43:13+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 54
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 122
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_01-34-43_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_01-34-43_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 4ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  01:43:14
   Duration  165ms (transform 25ms, setup 0ms, collect 23ms, tests 4ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 25 | ×2 | 50 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 1 | ×5 | 5 |
| Assignments | 21 | ×6 | 126 |
| **Total Mass** | | | **195** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 41 |
| Functions | 9 |
| Longest Function | 15 lines |
| Avg LOC/Function | 4.33 |
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
| McCabe (Cyclomatic) | 3 | 1.28 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7077652 |
| Context Utilization | 50% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 96.25s |
| Avg Red Phase | 18.18s |
| Avg Green Phase | 14.76s |
| Avg Refactor Phase | 63.31s |

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
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


