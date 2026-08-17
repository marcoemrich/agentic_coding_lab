# Analysis Report: 2026-08-16_23-29-31_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex

Generated: 2026-08-16T23:44:33+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | basic-sol-tdd-subagent-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 900s |
| Started | 2026-08-16T23:29:31+00:00 |
| Ended | 2026-08-16T23:44:33+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 50
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 111
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_23-29-31_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_23-29-31_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex

 ✓ src/sphinx-score.spec.ts  (11 tests) 382ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  23:44:34
   Duration  576ms (transform 41ms, setup 0ms, collect 29ms, tests 382ms, environment 0ms, prepare 74ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 82% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 23 | ×1 | 23 |
| Invocations | 12 | ×2 | 24 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 1 | ×5 | 5 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **124** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 41 |
| Functions | 1 |
| Longest Function | 20 lines |
| Avg LOC/Function | 20.00 |
| Median LOC/Function | 20.00 |
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
| Total Tokens | 1268365 |
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


