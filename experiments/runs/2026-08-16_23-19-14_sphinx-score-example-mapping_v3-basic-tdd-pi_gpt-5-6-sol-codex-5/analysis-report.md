# Analysis Report: 2026-08-16_23-19-14_sphinx-score-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-5

Generated: 2026-08-16T23:21:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 141s |
| Started | 2026-08-16T23:19:14+00:00 |
| Ended | 2026-08-16T23:21:38+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 49
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 43
- **Active tests**: 2
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_23-19-14_sphinx-score-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_23-19-14_sphinx-score-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex-5

 ✓ src/sphinx-score.spec.ts  (10 tests) 2ms
 ✓ src/cli.spec.ts  (2 tests) 1131ms

 Test Files  2 passed (2)
      Tests  12 passed (12)
   Start at  23:21:39
   Duration  1.58s (transform 34ms, setup 0ms, collect 32ms, tests 1.13s, environment 0ms, prepare 161ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 25 | ×1 | 25 |
| Invocations | 11 | ×2 | 22 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 1 | ×5 | 5 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **134** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 35 |
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
| McCabe (Cyclomatic) | 3 | 1.75 | 0 |
| Cognitive (SonarJS) | 2 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 249723 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


