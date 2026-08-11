# Analysis Report: 2026-08-11_08-44-19_sphinx-score-prose_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T09:21:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-prose |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2214s |
| Started | 2026-08-11T08:44:19+00:00 |
| Ended | 2026-08-11T09:21:14+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 57
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 146
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (20 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_08-44-19_sphinx-score-prose_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_08-44-19_sphinx-score-prose_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/sphinx-score.spec.ts  (16 tests) 4ms
 ✓ src/cli.spec.ts  (4 tests) 3ms

 Test Files  2 passed (2)
      Tests  20 passed (20)
   Start at  09:21:14
   Duration  322ms (transform 35ms, setup 0ms, collect 42ms, tests 7ms, environment 0ms, prepare 95ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 20 | ×1 | 20 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 2 | ×5 | 10 |
| Assignments | 14 | ×6 | 84 |
| **Total Mass** | | | **160** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 43 |
| Functions | 6 |
| Longest Function | 5 lines |
| Avg LOC/Function | 2.83 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 2 | 1.29 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 48424369 |
| Context Utilization | 139% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 20 |
| Avg Cycle Time | 99.08s |
| Avg Red Phase | 31.41s |
| Avg Green Phase | 28.09s |
| Avg Refactor Phase | 39.58s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 80 |
| Predictions Total | 80 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


