# Analysis Report: 2026-08-16_23-29-48_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex

Generated: 2026-08-16T23:47:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | basic-sol-tdd-subagent-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1055s |
| Started | 2026-08-16T23:29:48+00:00 |
| Ended | 2026-08-16T23:47:25+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 38
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 122
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_23-29-48_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_23-29-48_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex

 ✓ src/sphinx-score.spec.ts  (12 tests) 489ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  23:47:26
   Duration  661ms (transform 34ms, setup 0ms, collect 23ms, tests 489ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 63% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 19 | ×1 | 19 |
| Invocations | 13 | ×2 | 26 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 2 | ×5 | 10 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **141** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 28 |
| Functions | 2 |
| Longest Function | 7 lines |
| Avg LOC/Function | 5.50 |
| Median LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 2 | 1.25 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3125890 |
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
| Predictions Correct | 18 |
| Predictions Total | 18 |
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


