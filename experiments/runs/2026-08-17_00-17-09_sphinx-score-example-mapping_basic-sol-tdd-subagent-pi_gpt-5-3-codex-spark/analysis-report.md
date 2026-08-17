# Analysis Report: 2026-08-17_00-17-09_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-3-codex-spark

Generated: 2026-08-17T00:33:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | basic-sol-tdd-subagent-pi |
| Model | gpt-5-3-codex-spark |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 996s |
| Started | 2026-08-17T00:17:09+00:00 |
| Ended | 2026-08-17T00:33:46+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 78
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 144
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_00-17-09_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-3-codex-spark
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_00-17-09_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-3-codex-spark

 ✓ src/sphinx-score.spec.ts  (12 tests) 357ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  00:33:47
   Duration  522ms (transform 35ms, setup 0ms, collect 35ms, tests 357ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 15 | ×2 | 30 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 1 | ×5 | 5 |
| Assignments | 14 | ×6 | 84 |
| **Total Mass** | | | **156** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 65 |
| Functions | 3 |
| Longest Function | 20 lines |
| Avg LOC/Function | 15.00 |
| Median LOC/Function | 16.00 |
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
| McCabe (Cyclomatic) | 3 | 2.33 | 0 |
| Cognitive (SonarJS) | 3 | 1.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11785008 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 22 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 5 |
| Predictions Total | 6 |
| Accuracy | 83% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


