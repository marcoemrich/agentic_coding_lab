# Analysis Report: 2026-08-17_00-37-28_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-3-codex-spark-5

Generated: 2026-08-17T00:42:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | basic-sol-tdd-pi |
| Model | gpt-5-3-codex-spark |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 319s |
| Started | 2026-08-17T00:37:28+00:00 |
| Ended | 2026-08-17T00:42:49+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 70
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 139
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_00-37-28_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-3-codex-spark-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_00-37-28_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-3-codex-spark-5

 ✓ src/sphinx-score.spec.ts  (12 tests) 386ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  00:42:50
   Duration  566ms (transform 31ms, setup 0ms, collect 29ms, tests 386ms, environment 0ms, prepare 58ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 77% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 15 | ×2 | 30 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 1 | ×5 | 5 |
| Assignments | 19 | ×6 | 114 |
| **Total Mass** | | | **182** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 57 |
| Functions | 2 |
| Longest Function | 22 lines |
| Avg LOC/Function | 12.50 |
| Median LOC/Function | 12.50 |
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
| McCabe (Cyclomatic) | 3 | 1.29 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6191347 |
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
| Predictions Correct | 16 |
| Predictions Total | 24 |
| Accuracy | 66% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


