# Analysis Report: 2026-08-17_00-43-07_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-3-codex-spark

Generated: 2026-08-17T00:52:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | basic-sol-tdd-subagent-pi |
| Model | gpt-5-3-codex-spark |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 554s |
| Started | 2026-08-17T00:43:07+00:00 |
| Ended | 2026-08-17T00:52:22+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 59
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 153
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_00-43-07_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-3-codex-spark
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_00-43-07_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-3-codex-spark

 ✓ src/sphinx-score.spec.ts  (12 tests) 367ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  00:52:22
   Duration  518ms (transform 25ms, setup 0ms, collect 24ms, tests 367ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 22 | ×1 | 22 |
| Invocations | 13 | ×2 | 26 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 2 | ×5 | 10 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **156** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 47 |
| Functions | 1 |
| Longest Function | 29 lines |
| Avg LOC/Function | 29.00 |
| Median LOC/Function | 29.00 |
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
| McCabe (Cyclomatic) | 8 | 2.75 | 0 |
| Cognitive (SonarJS) | 8 | 8.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8583953 |
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
| Predictions Correct | 17 |
| Predictions Total | 22 |
| Accuracy | 77% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


