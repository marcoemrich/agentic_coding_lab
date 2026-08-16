# Analysis Report: 2026-08-16_09-34-25_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-no-thinking

Generated: 2026-08-16T09:42:35+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | gpt-5-6-sol-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 489s |
| Started | 2026-08-16T09:34:25+00:00 |
| Ended | 2026-08-16T09:42:35+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 52
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 87
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_09-34-25_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_09-34-25_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-no-thinking

 ✓ src/sphinx-score.spec.ts  (10 tests) 3ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  09:42:36
   Duration  152ms (transform 25ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 51% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 24 | ×1 | 24 |
| Invocations | 18 | ×2 | 36 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 4 | ×5 | 20 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **168** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 42 |
| Functions | 3 |
| Longest Function | 8 lines |
| Avg LOC/Function | 4.00 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 3 | 1.60 | 0 |
| Cognitive (SonarJS) | 2 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1406205 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 12 |
| Predictions Total | 12 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


