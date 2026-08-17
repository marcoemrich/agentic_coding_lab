# Analysis Report: 2026-08-16_23-29-36_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex

Generated: 2026-08-16T23:47:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | basic-sol-tdd-subagent-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1058s |
| Started | 2026-08-16T23:29:36+00:00 |
| Ended | 2026-08-16T23:47:16+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 55
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 110
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_23-29-36_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_23-29-36_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex

 ✓ src/sphinx-score.spec.ts  (11 tests) 376ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  23:47:17
   Duration  543ms (transform 23ms, setup 0ms, collect 23ms, tests 376ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 75% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 9 | ×2 | 18 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 1 | ×5 | 5 |
| Assignments | 17 | ×6 | 102 |
| **Total Mass** | | | **150** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 44 |
| Functions | 1 |
| Longest Function | 18 lines |
| Avg LOC/Function | 18.00 |
| Median LOC/Function | 18.00 |
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
| McCabe (Cyclomatic) | 1 | 1.00 | 0 |
| Cognitive (SonarJS) | 0 | 0 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3086804 |
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


