# Analysis Report: 2026-08-11_14-04-30_sphinx-score-example-mapping_v6.7-app-subordinate-cc_opus-5-no-thinking-2

Generated: 2026-08-11T14:27:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v6.7-app-subordinate-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1350s |
| Started | 2026-08-11T14:04:30+00:00 |
| Ended | 2026-08-11T14:27:02+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 55
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 105
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_14-04-30_sphinx-score-example-mapping_v6.7-app-subordinate-cc_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_14-04-30_sphinx-score-example-mapping_v6.7-app-subordinate-cc_opus-5-no-thinking-2

 ✓ src/sphinx-score.spec.ts  (10 tests) 4ms
 ✓ src/cli.spec.ts  (1 test) 482ms

 Test Files  2 passed (2)
      Tests  11 passed (11)
   Start at  14:27:03
   Duration  890ms (transform 48ms, setup 0ms, collect 56ms, tests 486ms, environment 0ms, prepare 111ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 65% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 10 | ×1 | 10 |
| Invocations | 17 | ×2 | 34 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 2 | ×5 | 10 |
| Assignments | 18 | ×6 | 108 |
| **Total Mass** | | | **166** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 38 |
| Functions | 9 |
| Longest Function | 5 lines |
| Avg LOC/Function | 2.78 |
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
| McCabe (Cyclomatic) | 3 | 1.30 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16417988 |
| Context Utilization | 73% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 100.42s |
| Avg Red Phase | 25.47s |
| Avg Green Phase | 17.19s |
| Avg Refactor Phase | 57.76s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 22 |
| Predictions Total | 22 |
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


