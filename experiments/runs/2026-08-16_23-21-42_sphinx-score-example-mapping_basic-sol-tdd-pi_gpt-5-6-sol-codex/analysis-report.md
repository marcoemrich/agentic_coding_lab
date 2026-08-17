# Analysis Report: 2026-08-16_23-21-42_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-6-sol-codex

Generated: 2026-08-16T23:29:29+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | basic-sol-tdd-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 465s |
| Started | 2026-08-16T23:21:42+00:00 |
| Ended | 2026-08-16T23:29:29+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 46
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 115
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_23-21-42_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_23-21-42_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-6-sol-codex

 ✓ src/sphinx-score.spec.ts  (12 tests) 426ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  23:29:30
   Duration  605ms (transform 28ms, setup 0ms, collect 26ms, tests 426ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 83% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 22 | ×1 | 22 |
| Invocations | 11 | ×2 | 22 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 1 | ×5 | 5 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **117** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 38 |
| Functions | 1 |
| Longest Function | 11 lines |
| Avg LOC/Function | 11.00 |
| Median LOC/Function | 11.00 |
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
| McCabe (Cyclomatic) | 2 | 1.33 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1919005 |
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


