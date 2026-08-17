# Analysis Report: 2026-08-16_23-22-37_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-6-sol-codex

Generated: 2026-08-16T23:29:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | basic-sol-tdd-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 440s |
| Started | 2026-08-16T23:22:37+00:00 |
| Ended | 2026-08-16T23:29:59+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 48
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 120
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_23-22-37_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_23-22-37_sphinx-score-example-mapping_basic-sol-tdd-pi_gpt-5-6-sol-codex

 ✓ src/sphinx-score.spec.ts  (12 tests) 446ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  23:29:59
   Duration  622ms (transform 26ms, setup 0ms, collect 24ms, tests 446ms, environment 0ms, prepare 63ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 75% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 12 | ×2 | 24 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 2 | ×5 | 10 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **135** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 38 |
| Functions | 1 |
| Longest Function | 14 lines |
| Avg LOC/Function | 14.00 |
| Median LOC/Function | 14.00 |
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
| McCabe (Cyclomatic) | 3 | 1.67 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1497588 |
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


