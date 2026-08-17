# Analysis Report: 2026-08-16_23-19-14_sphinx-score-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-4

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
- **Implementation LOC** (total): 45
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 83
- **Active tests**: 1
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_23-19-14_sphinx-score-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_23-19-14_sphinx-score-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-4

 ✓ src/sphinx-score.spec.ts  (11 tests) 485ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  23:21:38
   Duration  686ms (transform 25ms, setup 0ms, collect 25ms, tests 485ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 75% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 24 | ×1 | 24 |
| Invocations | 11 | ×2 | 22 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 1 | ×5 | 5 |
| Assignments | 9 | ×6 | 54 |
| **Total Mass** | | | **117** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 35 |
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
| McCabe (Cyclomatic) | 4 | 1.75 | 0 |
| Cognitive (SonarJS) | 3 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 212854 |
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


