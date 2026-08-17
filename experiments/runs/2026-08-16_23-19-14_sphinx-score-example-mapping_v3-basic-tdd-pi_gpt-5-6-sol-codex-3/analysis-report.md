# Analysis Report: 2026-08-16_23-19-14_sphinx-score-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-3

Generated: 2026-08-16T23:21:37+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 140s |
| Started | 2026-08-16T23:19:14+00:00 |
| Ended | 2026-08-16T23:21:37+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 51
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 115
- **Active tests**: 4
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_23-19-14_sphinx-score-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_23-19-14_sphinx-score-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-3

 ✓ src/sphinx-score.spec.ts  (11 tests) 3ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  23:21:37
   Duration  206ms (transform 26ms, setup 0ms, collect 24ms, tests 3ms, environment 0ms, prepare 61ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 64% |
| Branches | 83% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 18 | ×1 | 18 |
| Invocations | 13 | ×2 | 26 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 2 | ×5 | 10 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **118** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 39 |
| Functions | 2 |
| Longest Function | 11 lines |
| Avg LOC/Function | 10.00 |
| Median LOC/Function | 10.00 |
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
| McCabe (Cyclomatic) | 2 | 1.50 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 168910 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


