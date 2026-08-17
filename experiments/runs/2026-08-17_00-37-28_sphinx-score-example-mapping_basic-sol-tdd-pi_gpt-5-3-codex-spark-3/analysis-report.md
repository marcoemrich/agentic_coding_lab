# Analysis Report: 2026-08-17_00-37-28_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-3-codex-spark-3

Generated: 2026-08-17T00:44:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | basic-sol-tdd-pi |
| Model | gpt-5-3-codex-spark |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 405s |
| Started | 2026-08-17T00:37:28+00:00 |
| Ended | 2026-08-17T00:44:15+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 62
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 141
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_00-37-28_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-3-codex-spark-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_00-37-28_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-3-codex-spark-3

 ✓ src/sphinx-score.spec.ts  (11 tests) 372ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  00:44:16
   Duration  532ms (transform 24ms, setup 0ms, collect 23ms, tests 372ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 66% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 20 | ×1 | 20 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 2 | ×5 | 10 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **154** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 48 |
| Functions | 3 |
| Longest Function | 21 lines |
| Avg LOC/Function | 12.33 |
| Median LOC/Function | 9.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 5 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 2.00 | 0 |
| Cognitive (SonarJS) | 4 | 3.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 876921 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 1 |
| Predictions Total | 2 |
| Accuracy | 50% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


