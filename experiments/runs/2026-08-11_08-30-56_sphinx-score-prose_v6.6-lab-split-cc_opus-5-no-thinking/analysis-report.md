# Analysis Report: 2026-08-11_08-30-56_sphinx-score-prose_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T08:44:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-prose |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 784s |
| Started | 2026-08-11T08:30:56+00:00 |
| Ended | 2026-08-11T08:44:01+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 40
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 100
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_08-30-56_sphinx-score-prose_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_08-30-56_sphinx-score-prose_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/sphinx-score.spec.ts  (13 tests) 3ms
 ✓ src/cli.spec.ts  (1 test) 338ms

 Test Files  2 passed (2)
      Tests  14 passed (14)
   Start at  08:44:02
   Duration  663ms (transform 32ms, setup 0ms, collect 34ms, tests 341ms, environment 0ms, prepare 102ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 60% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 7 | ×1 | 7 |
| Invocations | 15 | ×2 | 30 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 3 | ×5 | 15 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **150** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 29 |
| Functions | 5 |
| Longest Function | 8 lines |
| Avg LOC/Function | 3.80 |
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
| Total Tokens | 11547572 |
| Context Utilization | 65% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
| Avg Cycle Time | 89.53s |
| Avg Red Phase | 21.31s |
| Avg Green Phase | 20.07s |
| Avg Refactor Phase | 48.15s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 28 |
| Predictions Total | 28 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 9 |


