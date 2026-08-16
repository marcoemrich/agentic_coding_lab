# Analysis Report: 2026-08-16_09-54-34_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-no-thinking

Generated: 2026-08-16T10:02:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | gpt-5-6-sol-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 459s |
| Started | 2026-08-16T09:54:34+00:00 |
| Ended | 2026-08-16T10:02:14+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 49
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 79
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_09-54-34_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_09-54-34_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-no-thinking

 ✓ src/sphinx-score.spec.ts  (11 tests) 367ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  10:02:14
   Duration  516ms (transform 23ms, setup 0ms, collect 23ms, tests 367ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 23 | ×1 | 23 |
| Invocations | 11 | ×2 | 22 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 1 | ×5 | 5 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **118** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 40 |
| Functions | 1 |
| Longest Function | 19 lines |
| Avg LOC/Function | 19.00 |
| Median LOC/Function | 19.00 |
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
| McCabe (Cyclomatic) | 3 | 1.50 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1575162 |
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
| Predictions Correct | 13 |
| Predictions Total | 14 |
| Accuracy | 92% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


