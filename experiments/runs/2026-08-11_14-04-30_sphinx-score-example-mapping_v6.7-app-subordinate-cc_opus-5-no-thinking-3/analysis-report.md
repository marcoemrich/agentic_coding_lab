# Analysis Report: 2026-08-11_14-04-30_sphinx-score-example-mapping_v6.7-app-subordinate-cc_opus-5-no-thinking-3

Generated: 2026-08-11T14:29:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v6.7-app-subordinate-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1491s |
| Started | 2026-08-11T14:04:30+00:00 |
| Ended | 2026-08-11T14:29:23+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 46
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 123
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_14-04-30_sphinx-score-example-mapping_v6.7-app-subordinate-cc_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_14-04-30_sphinx-score-example-mapping_v6.7-app-subordinate-cc_opus-5-no-thinking-3

 ✓ src/sphinx-score.spec.ts  (12 tests) 3ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  14:29:24
   Duration  218ms (transform 32ms, setup 0ms, collect 29ms, tests 3ms, environment 0ms, prepare 56ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 69% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 9 | ×1 | 9 |
| Invocations | 21 | ×2 | 42 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 3 | ×5 | 15 |
| Assignments | 17 | ×6 | 102 |
| **Total Mass** | | | **176** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 36 |
| Functions | 8 |
| Longest Function | 5 lines |
| Avg LOC/Function | 2.62 |
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
| McCabe (Cyclomatic) | 2 | 1.27 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15418755 |
| Context Utilization | 72% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 119.02s |
| Avg Red Phase | 27.63s |
| Avg Green Phase | 25.89s |
| Avg Refactor Phase | 65.5s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 24 |
| Predictions Total | 24 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


