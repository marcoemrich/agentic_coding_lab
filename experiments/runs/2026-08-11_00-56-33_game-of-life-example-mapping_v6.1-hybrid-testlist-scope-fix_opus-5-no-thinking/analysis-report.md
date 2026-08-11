# Analysis Report: 2026-08-11_00-56-33_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-11T01:06:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 612s |
| Started | 2026-08-11T00:56:33+00:00 |
| Ended | 2026-08-11T01:06:46+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 49
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 102
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_00-56-33_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_00-56-33_game-of-life-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

 ✓ src/game-of-life.spec.ts  (10 tests) 5ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  01:06:47
   Duration  183ms (transform 28ms, setup 1ms, collect 25ms, tests 5ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 7 | ×1 | 7 |
| Invocations | 24 | ×2 | 48 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 3 | ×5 | 15 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **142** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 42 |
| Functions | 6 |
| Longest Function | 12 lines |
| Avg LOC/Function | 5.33 |
| Median LOC/Function | 3.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 3 | 1.25 | 0 |
| Cognitive (SonarJS) | 2 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8747335 |
| Context Utilization | 54% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 100.94s |
| Avg Red Phase | 18.59s |
| Avg Green Phase | 20.86s |
| Avg Refactor Phase | 61.49s |

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
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


