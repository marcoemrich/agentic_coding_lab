# Analysis Report: 2026-08-11_09-04-41_sphinx-score-prose_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T09:29:11+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-prose |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1469s |
| Started | 2026-08-11T09:04:41+00:00 |
| Ended | 2026-08-11T09:29:11+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 37
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 143
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_09-04-41_sphinx-score-prose_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_09-04-41_sphinx-score-prose_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/sphinx-score.spec.ts  (15 tests) 3ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  09:29:12
   Duration  188ms (transform 38ms, setup 0ms, collect 37ms, tests 3ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 78% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 7 | ×1 | 7 |
| Invocations | 14 | ×2 | 28 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 1 | ×5 | 5 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **110** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 25 |
| Functions | 6 |
| Longest Function | 6 lines |
| Avg LOC/Function | 2.67 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 2 | 1.17 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 25150430 |
| Context Utilization | 95% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 15 |
| Avg Cycle Time | 84.27s |
| Avg Red Phase | 22.64s |
| Avg Green Phase | 18.32s |
| Avg Refactor Phase | 43.31s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 30 |
| Predictions Total | 30 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


