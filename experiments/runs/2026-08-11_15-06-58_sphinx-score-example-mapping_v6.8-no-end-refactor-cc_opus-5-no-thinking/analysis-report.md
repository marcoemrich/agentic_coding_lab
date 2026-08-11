# Analysis Report: 2026-08-11_15-06-58_sphinx-score-example-mapping_v6.8-no-end-refactor-cc_opus-5-no-thinking

Generated: 2026-08-11T15:22:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v6.8-no-end-refactor-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 953s |
| Started | 2026-08-11T15:06:58+00:00 |
| Ended | 2026-08-11T15:22:53+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 52
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 133
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_15-06-58_sphinx-score-example-mapping_v6.8-no-end-refactor-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_15-06-58_sphinx-score-example-mapping_v6.8-no-end-refactor-cc_opus-5-no-thinking

 ✓ src/sphinx-score.spec.ts  (11 tests) 420ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  15:22:54
   Duration  619ms (transform 32ms, setup 0ms, collect 29ms, tests 420ms, environment 0ms, prepare 67ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 61% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 9 | ×1 | 9 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 3 | ×5 | 15 |
| Assignments | 21 | ×6 | 126 |
| **Total Mass** | | | **200** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 42 |
| Functions | 6 |
| Longest Function | 7 lines |
| Avg LOC/Function | 3.50 |
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
| McCabe (Cyclomatic) | 2 | 1.33 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10660909 |
| Context Utilization | 63% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 122.80s |
| Avg Red Phase | 28s |
| Avg Green Phase | 26.85s |
| Avg Refactor Phase | 67.95s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 22 |
| Predictions Total | 22 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


