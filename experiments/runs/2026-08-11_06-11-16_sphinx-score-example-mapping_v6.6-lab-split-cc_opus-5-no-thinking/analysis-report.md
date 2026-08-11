# Analysis Report: 2026-08-11_06-11-16_sphinx-score-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T06:36:04+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1486s |
| Started | 2026-08-11T06:11:16+00:00 |
| Ended | 2026-08-11T06:36:03+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 48
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 141
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_06-11-16_sphinx-score-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_06-11-16_sphinx-score-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/sphinx-score.spec.ts  (11 tests) 382ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  06:36:04
   Duration  601ms (transform 43ms, setup 0ms, collect 44ms, tests 382ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 75% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 9 | ×1 | 9 |
| Invocations | 16 | ×2 | 32 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 2 | ×5 | 10 |
| Assignments | 18 | ×6 | 108 |
| **Total Mass** | | | **167** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 33 |
| Functions | 5 |
| Longest Function | 7 lines |
| Avg LOC/Function | 5.20 |
| Median LOC/Function | 6.00 |
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
| Total Tokens | 19340986 |
| Context Utilization | 79% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 113.35s |
| Avg Red Phase | 23.01s |
| Avg Green Phase | 22.88s |
| Avg Refactor Phase | 67.46s |

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


