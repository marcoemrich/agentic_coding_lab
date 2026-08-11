# Analysis Report: 2026-08-11_07-58-43_sphinx-score-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking-2

Generated: 2026-08-11T08:30:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1911s |
| Started | 2026-08-11T07:58:43+00:00 |
| Ended | 2026-08-11T08:30:36+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 74
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 113
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_07-58-43_sphinx-score-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_07-58-43_sphinx-score-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking-2

 ✓ src/sphinx-score.spec.ts  (12 tests) 2ms
 ✓ src/cli.spec.ts  (4 tests) 447ms

 Test Files  2 passed (2)
      Tests  16 passed (16)
   Start at  08:30:37
   Duration  797ms (transform 36ms, setup 0ms, collect 46ms, tests 449ms, environment 0ms, prepare 108ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 13 | ×1 | 13 |
| Invocations | 25 | ×2 | 50 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 2 | ×5 | 10 |
| Assignments | 27 | ×6 | 162 |
| **Total Mass** | | | **251** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 54 |
| Functions | 9 |
| Longest Function | 7 lines |
| Avg LOC/Function | 3.56 |
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
| McCabe (Cyclomatic) | 2 | 1.40 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 30728141 |
| Context Utilization | 104% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 16 |
| Avg Cycle Time | 102.16s |
| Avg Red Phase | 24.03s |
| Avg Green Phase | 20.68s |
| Avg Refactor Phase | 57.45s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 31 |
| Predictions Total | 32 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


