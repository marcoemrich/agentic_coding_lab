# Analysis Report: 2026-08-17_00-43-42_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-3-codex-spark

Generated: 2026-08-17T00:51:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | basic-sol-tdd-subagent-pi |
| Model | gpt-5-3-codex-spark |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 457s |
| Started | 2026-08-17T00:43:42+00:00 |
| Ended | 2026-08-17T00:51:21+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 55
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 134
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_00-43-42_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-3-codex-spark
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_00-43-42_sphinx-score-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-3-codex-spark

 ✓ src/sphinx-score.spec.ts  (11 tests) 3ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  00:51:22
   Duration  152ms (transform 25ms, setup 0ms, collect 23ms, tests 3ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 13 | ×1 | 13 |
| Invocations | 16 | ×2 | 32 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 1 | ×5 | 5 |
| Assignments | 19 | ×6 | 114 |
| **Total Mass** | | | **184** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 44 |
| Functions | 2 |
| Longest Function | 18 lines |
| Avg LOC/Function | 15.00 |
| Median LOC/Function | 15.00 |
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
| McCabe (Cyclomatic) | 4 | 1.80 | 0 |
| Cognitive (SonarJS) | 3 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3610089 |
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
| Predictions Correct | 9 |
| Predictions Total | 10 |
| Accuracy | 90% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


