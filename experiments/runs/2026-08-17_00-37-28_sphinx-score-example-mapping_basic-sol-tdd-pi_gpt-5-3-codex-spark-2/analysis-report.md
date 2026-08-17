# Analysis Report: 2026-08-17_00-37-28_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-3-codex-spark-2

Generated: 2026-08-17T00:43:37+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | basic-sol-tdd-pi |
| Model | gpt-5-3-codex-spark |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 367s |
| Started | 2026-08-17T00:37:28+00:00 |
| Ended | 2026-08-17T00:43:37+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 69
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 48
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_00-37-28_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-3-codex-spark-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_00-37-28_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-3-codex-spark-2

 ✓ src/sphinx-score.spec.ts  (12 tests) 371ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  00:43:37
   Duration  530ms (transform 19ms, setup 0ms, collect 16ms, tests 371ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 16 | ×1 | 16 |
| Invocations | 14 | ×2 | 28 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 1 | ×5 | 5 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **169** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 55 |
| Functions | 1 |
| Longest Function | 26 lines |
| Avg LOC/Function | 26.00 |
| Median LOC/Function | 26.00 |
| Imports | 3 |

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
| McCabe (Cyclomatic) | 7 | 3.00 | 0 |
| Cognitive (SonarJS) | 6 | 6.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7762164 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 24 |
| Predictions Total | 24 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


