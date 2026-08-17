# Analysis Report: 2026-08-17_00-40-26_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-3-codex-spark

Generated: 2026-08-17T00:50:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | basic-sol-tdd-subagent-pi |
| Model | gpt-5-3-codex-spark |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 609s |
| Started | 2026-08-17T00:40:26+00:00 |
| Ended | 2026-08-17T00:50:36+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 43
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 147
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_00-40-26_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-3-codex-spark
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_00-40-26_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-3-codex-spark

 ✓ src/sphinx-score.spec.ts  (11 tests) 375ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  00:50:36
   Duration  529ms (transform 25ms, setup 0ms, collect 24ms, tests 375ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 55% |
| Branches | 80% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 14 | ×2 | 28 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 2 | ×5 | 10 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **122** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 34 |
| Functions | 2 |
| Longest Function | 10 lines |
| Avg LOC/Function | 8.50 |
| Median LOC/Function | 8.50 |
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
| Total Tokens | 4408026 |
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
| Predictions Total | 22 |
| Accuracy | 63% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


