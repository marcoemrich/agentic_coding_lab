# Analysis Report: 2026-08-11_14-47-44_sphinx-score-example-mapping_v6.8-no-end-refactor-cc_opus-5-no-thinking

Generated: 2026-08-11T15:06:41+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v6.8-no-end-refactor-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1135s |
| Started | 2026-08-11T14:47:44+00:00 |
| Ended | 2026-08-11T15:06:41+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 70
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 105
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_14-47-44_sphinx-score-example-mapping_v6.8-no-end-refactor-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_14-47-44_sphinx-score-example-mapping_v6.8-no-end-refactor-cc_opus-5-no-thinking

 ✓ src/sphinx-score.spec.ts  (10 tests) 2ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  15:06:42
   Duration  181ms (transform 28ms, setup 0ms, collect 34ms, tests 2ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 71% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 18 | ×1 | 18 |
| Invocations | 23 | ×2 | 46 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 3 | ×5 | 15 |
| Assignments | 21 | ×6 | 126 |
| **Total Mass** | | | **213** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 43 |
| Functions | 10 |
| Longest Function | 6 lines |
| Avg LOC/Function | 3.10 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 2 | 1.30 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14243815 |
| Context Utilization | 71% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 110.65s |
| Avg Red Phase | 21.41s |
| Avg Green Phase | 20.1s |
| Avg Refactor Phase | 69.14s |

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


