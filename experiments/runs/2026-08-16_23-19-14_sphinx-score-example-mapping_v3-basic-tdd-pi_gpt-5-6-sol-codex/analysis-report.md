# Analysis Report: 2026-08-16_23-19-14_sphinx-score-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex

Generated: 2026-08-16T23:21:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 125s |
| Started | 2026-08-16T23:19:14+00:00 |
| Ended | 2026-08-16T23:21:22+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 50
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 69
- **Active tests**: 3
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_23-19-14_sphinx-score-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_23-19-14_sphinx-score-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex

 ✓ src/sphinx-score.spec.ts  (12 tests) 376ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  23:21:23
   Duration  544ms (transform 26ms, setup 0ms, collect 28ms, tests 376ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 72% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 22 | ×1 | 22 |
| Invocations | 13 | ×2 | 26 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 2 | ×5 | 10 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **132** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 39 |
| Functions | 1 |
| Longest Function | 16 lines |
| Avg LOC/Function | 16.00 |
| Median LOC/Function | 16.00 |
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
| McCabe (Cyclomatic) | 3 | 1.50 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 130964 |
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


