# Analysis Report: 2026-08-16_23-19-14_sphinx-score-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-2

Generated: 2026-08-16T23:22:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 178s |
| Started | 2026-08-16T23:19:14+00:00 |
| Ended | 2026-08-16T23:22:15+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 55
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 69
- **Active tests**: 5
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_23-19-14_sphinx-score-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_23-19-14_sphinx-score-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-2

 ✓ src/sphinx-score.spec.ts  (12 tests) 3ms
 ✓ src/cli.spec.ts  (2 tests) 834ms

 Test Files  2 passed (2)
      Tests  14 passed (14)
   Start at  23:22:16
   Duration  1.22s (transform 31ms, setup 0ms, collect 32ms, tests 837ms, environment 0ms, prepare 135ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 69% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 23 | ×1 | 23 |
| Invocations | 15 | ×2 | 30 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 2 | ×5 | 10 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **147** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 40 |
| Functions | 2 |
| Longest Function | 17 lines |
| Avg LOC/Function | 13.50 |
| Median LOC/Function | 13.50 |
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
| McCabe (Cyclomatic) | 4 | 2.00 | 0 |
| Cognitive (SonarJS) | 3 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 614375 |
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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


