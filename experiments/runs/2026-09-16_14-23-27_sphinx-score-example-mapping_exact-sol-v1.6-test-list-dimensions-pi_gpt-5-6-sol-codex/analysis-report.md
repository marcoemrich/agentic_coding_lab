# Analysis Report: 2026-09-16_14-23-27_sphinx-score-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex

Generated: 2026-09-16T14:35:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | exact-sol-v1.6-test-list-dimensions-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 691s |
| Started | 2026-09-16T14:23:29+00:00 |
| Ended | 2026-09-16T14:35:03+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 57
- **Test files**: sphinx-score.spec.ts
- **Test LOC** (total): 124
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_14-23-27_sphinx-score-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_14-23-27_sphinx-score-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex

 ✓ src/sphinx-score.spec.ts  (13 tests) 661ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  14:35:04
   Duration  977ms (transform 69ms, setup 0ms, collect 59ms, tests 661ms, environment 0ms, prepare 72ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 75% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 20 | ×1 | 20 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 2 | ×5 | 10 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **146** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 46 |
| Functions | 4 |
| Longest Function | 7 lines |
| Avg LOC/Function | 5.00 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 2 | 1.50 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1923985 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 25 |
| Predictions Total | 26 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


