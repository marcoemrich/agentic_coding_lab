# Analysis Report: 2026-08-17_00-37-28_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-3-codex-spark-4

Generated: 2026-08-17T00:40:07+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | basic-sol-tdd-pi |
| Model | gpt-5-3-codex-spark |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 157s |
| Started | 2026-08-17T00:37:28+00:00 |
| Ended | 2026-08-17T00:40:07+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 47
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 157
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_00-37-28_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-3-codex-spark-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_00-37-28_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-3-codex-spark-4

 ✓ src/sphinx-score.spec.ts  (11 tests) 438ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  00:40:07
   Duration  604ms (transform 28ms, setup 0ms, collect 26ms, tests 438ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 72% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 11 | ×1 | 11 |
| Invocations | 14 | ×2 | 28 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 2 | ×5 | 10 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **123** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 36 |
| Functions | 1 |
| Longest Function | 21 lines |
| Avg LOC/Function | 21.00 |
| Median LOC/Function | 21.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 3 | 1.50 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2201386 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 5 |
| Predictions Total | 8 |
| Accuracy | 62% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


