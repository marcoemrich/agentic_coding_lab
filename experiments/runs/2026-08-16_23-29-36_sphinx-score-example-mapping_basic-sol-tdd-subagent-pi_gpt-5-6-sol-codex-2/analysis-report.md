# Analysis Report: 2026-08-16_23-29-36_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex-2

Generated: 2026-08-16T23:44:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | basic-sol-tdd-subagent-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 878s |
| Started | 2026-08-16T23:29:36+00:00 |
| Ended | 2026-08-16T23:44:16+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 52
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 129
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_23-29-36_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_23-29-36_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex-2

 ✓ src/sphinx-score.spec.ts  (11 tests) 500ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  23:44:17
   Duration  667ms (transform 29ms, setup 0ms, collect 24ms, tests 500ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 80% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 25 | ×1 | 25 |
| Invocations | 11 | ×2 | 22 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 1 | ×5 | 5 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **130** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 44 |
| Functions | 1 |
| Longest Function | 21 lines |
| Avg LOC/Function | 21.00 |
| Median LOC/Function | 21.00 |
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
| Total Tokens | 2528678 |
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
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


