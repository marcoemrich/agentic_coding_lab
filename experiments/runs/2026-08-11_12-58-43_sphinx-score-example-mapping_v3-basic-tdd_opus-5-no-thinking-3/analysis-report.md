# Analysis Report: 2026-08-11_12-58-43_sphinx-score-example-mapping_v3-basic-tdd_opus-5-no-thinking-3

Generated: 2026-08-11T13:03:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 269s |
| Started | 2026-08-11T12:58:43+00:00 |
| Ended | 2026-08-11T13:03:14+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 93
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 77
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_12-58-43_sphinx-score-example-mapping_v3-basic-tdd_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_12-58-43_sphinx-score-example-mapping_v3-basic-tdd_opus-5-no-thinking-3

 ✓ src/sphinx-score.spec.ts  (11 tests) 4ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  13:03:14
   Duration  176ms (transform 26ms, setup 0ms, collect 24ms, tests 4ms, environment 0ms, prepare 55ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 67% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 25 | ×1 | 25 |
| Invocations | 25 | ×2 | 50 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 4 | ×5 | 20 |
| Assignments | 19 | ×6 | 114 |
| **Total Mass** | | | **233** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 66 |
| Functions | 4 |
| Longest Function | 13 lines |
| Avg LOC/Function | 8.00 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 3 | 1.62 | 0 |
| Cognitive (SonarJS) | 2 | 1.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2751625 |
| Context Utilization | 30% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 22.35s |
| Avg Red Phase | 3.46s |
| Avg Green Phase | 2.62s |
| Avg Refactor Phase | 16.27s |

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
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


