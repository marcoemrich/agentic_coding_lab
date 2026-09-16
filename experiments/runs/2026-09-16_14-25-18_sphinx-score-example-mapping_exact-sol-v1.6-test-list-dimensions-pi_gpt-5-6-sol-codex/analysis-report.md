# Analysis Report: 2026-09-16_14-25-18_sphinx-score-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex

Generated: 2026-09-16T14:37:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | exact-sol-v1.6-test-list-dimensions-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 699s |
| Started | 2026-09-16T14:25:19+00:00 |
| Ended | 2026-09-16T14:37:01+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 57
- **Test files**: sphinx-score.spec.ts
- **Test LOC** (total): 133
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_14-25-18_sphinx-score-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_14-25-18_sphinx-score-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex

 ✓ src/sphinx-score.spec.ts  (13 tests) 697ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  14:37:03
   Duration  1.07s (transform 61ms, setup 0ms, collect 56ms, tests 697ms, environment 0ms, prepare 112ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 84% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 24 | ×1 | 24 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 1 | ×5 | 5 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **157** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 46 |
| Functions | 5 |
| Longest Function | 7 lines |
| Avg LOC/Function | 4.80 |
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
| McCabe (Cyclomatic) | 2 | 1.43 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2087662 |
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


