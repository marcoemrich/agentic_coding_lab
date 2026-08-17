# Analysis Report: 2026-08-16_23-21-59_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-6-sol-codex

Generated: 2026-08-16T23:29:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | basic-sol-tdd-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 436s |
| Started | 2026-08-16T23:21:59+00:00 |
| Ended | 2026-08-16T23:29:16+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 46
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 100
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_23-21-59_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_23-21-59_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-6-sol-codex

 ✓ src/sphinx-score.spec.ts  (11 tests) 595ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  23:29:17
   Duration  798ms (transform 33ms, setup 0ms, collect 27ms, tests 595ms, environment 0ms, prepare 61ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 80% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 26 | ×1 | 26 |
| Invocations | 13 | ×2 | 26 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 1 | ×5 | 5 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **143** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 36 |
| Functions | 1 |
| Longest Function | 17 lines |
| Avg LOC/Function | 17.00 |
| Median LOC/Function | 17.00 |
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
| Total Tokens | 1466059 |
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
| Predictions Correct | 14 |
| Predictions Total | 14 |
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


