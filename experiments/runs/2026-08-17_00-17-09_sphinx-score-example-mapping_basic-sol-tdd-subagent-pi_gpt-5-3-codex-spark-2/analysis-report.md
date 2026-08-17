# Analysis Report: 2026-08-17_00-17-09_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-3-codex-spark-2

Generated: 2026-08-17T00:26:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | basic-sol-tdd-subagent-pi |
| Model | gpt-5-3-codex-spark |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 535s |
| Started | 2026-08-17T00:17:09+00:00 |
| Ended | 2026-08-17T00:26:05+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 56
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 126
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_00-17-09_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-3-codex-spark-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_00-17-09_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-3-codex-spark-2

 ✓ src/sphinx-score.spec.ts  (11 tests) 362ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  00:26:06
   Duration  520ms (transform 23ms, setup 0ms, collect 22ms, tests 362ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 26 | ×1 | 26 |
| Invocations | 11 | ×2 | 22 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 1 | ×5 | 5 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **141** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 47 |
| Functions | 1 |
| Longest Function | 29 lines |
| Avg LOC/Function | 29.00 |
| Median LOC/Function | 29.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 5.00 | 0 |
| Cognitive (SonarJS) | 6 | 6.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2676666 |
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
| Predictions Correct | 17 |
| Predictions Total | 17 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


