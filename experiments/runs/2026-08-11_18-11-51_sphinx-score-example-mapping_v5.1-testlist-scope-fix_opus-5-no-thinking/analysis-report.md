# Analysis Report: 2026-08-11_18-11-51_sphinx-score-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-11T18:27:12+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v5.1-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 920s |
| Started | 2026-08-11T18:11:51+00:00 |
| Ended | 2026-08-11T18:27:12+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 59
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 73
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_18-11-51_sphinx-score-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_18-11-51_sphinx-score-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

 ✓ src/sphinx-score.spec.ts  (10 tests) 3ms
 ✓ src/cli.spec.ts  (3 tests) 3ms

 Test Files  2 passed (2)
      Tests  13 passed (13)
   Start at  18:27:13
   Duration  280ms (transform 30ms, setup 0ms, collect 33ms, tests 6ms, environment 0ms, prepare 85ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 16 | ×2 | 32 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 2 | ×5 | 10 |
| Assignments | 17 | ×6 | 102 |
| **Total Mass** | | | **177** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 45 |
| Functions | 6 |
| Longest Function | 7 lines |
| Avg LOC/Function | 3.67 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 2 | 1.43 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 29666022 |
| Context Utilization | 109% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 76.90s |
| Avg Red Phase | 23.33s |
| Avg Green Phase | 21.82s |
| Avg Refactor Phase | 31.75s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


