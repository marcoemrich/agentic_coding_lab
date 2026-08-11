# Analysis Report: 2026-08-11_12-58-43_sphinx-score-example-mapping_v3-basic-tdd_opus-5-no-thinking-4

Generated: 2026-08-11T13:03:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 268s |
| Started | 2026-08-11T12:58:43+00:00 |
| Ended | 2026-08-11T13:03:13+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 74
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 89
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_12-58-43_sphinx-score-example-mapping_v3-basic-tdd_opus-5-no-thinking-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_12-58-43_sphinx-score-example-mapping_v3-basic-tdd_opus-5-no-thinking-4

 ✓ src/sphinx-score.spec.ts  (13 tests) 3ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  13:03:14
   Duration  179ms (transform 25ms, setup 0ms, collect 23ms, tests 3ms, environment 0ms, prepare 56ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 67% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 23 | ×1 | 23 |
| Invocations | 18 | ×2 | 36 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 4 | ×5 | 20 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **151** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 58 |
| Functions | 3 |
| Longest Function | 8 lines |
| Avg LOC/Function | 7.33 |
| Median LOC/Function | 8.00 |
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
| McCabe (Cyclomatic) | 2 | 1.50 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2773200 |
| Context Utilization | 30% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 41.65s |
| Avg Red Phase | 4.76s |
| Avg Green Phase | 7.22s |
| Avg Refactor Phase | 29.67s |

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


