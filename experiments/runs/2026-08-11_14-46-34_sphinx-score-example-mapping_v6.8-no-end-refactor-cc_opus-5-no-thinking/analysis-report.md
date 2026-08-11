# Analysis Report: 2026-08-11_14-46-34_sphinx-score-example-mapping_v6.8-no-end-refactor-cc_opus-5-no-thinking

Generated: 2026-08-11T15:02:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v6.8-no-end-refactor-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 927s |
| Started | 2026-08-11T14:46:34+00:00 |
| Ended | 2026-08-11T15:02:03+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 64
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 105
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_14-46-34_sphinx-score-example-mapping_v6.8-no-end-refactor-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_14-46-34_sphinx-score-example-mapping_v6.8-no-end-refactor-cc_opus-5-no-thinking

 ✓ src/sphinx-score.spec.ts  (10 tests) 3ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  15:02:04
   Duration  169ms (transform 27ms, setup 0ms, collect 25ms, tests 3ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 76% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 21 | ×2 | 42 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 3 | ×5 | 15 |
| Assignments | 20 | ×6 | 120 |
| **Total Mass** | | | **203** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 51 |
| Functions | 7 |
| Longest Function | 9 lines |
| Avg LOC/Function | 3.86 |
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
| McCabe (Cyclomatic) | 2 | 1.33 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11319763 |
| Context Utilization | 64% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 117.20s |
| Avg Red Phase | 24.64s |
| Avg Green Phase | 21.91s |
| Avg Refactor Phase | 70.65s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 20 |
| Predictions Total | 20 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


