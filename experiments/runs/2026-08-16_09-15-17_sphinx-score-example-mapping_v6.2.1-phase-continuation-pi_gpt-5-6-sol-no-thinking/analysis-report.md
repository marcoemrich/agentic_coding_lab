# Analysis Report: 2026-08-16_09-15-17_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-no-thinking

Generated: 2026-08-16T09:22:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | gpt-5-6-sol-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 410s |
| Started | 2026-08-16T09:15:17+00:00 |
| Ended | 2026-08-16T09:22:08+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 23
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 88
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_09-15-17_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_09-15-17_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-no-thinking

 ✓ src/sphinx-score.spec.ts  (12 tests) 361ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  09:22:09
   Duration  516ms (transform 27ms, setup 0ms, collect 24ms, tests 361ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 56% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 11 | ×2 | 22 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 2 | ×5 | 10 |
| Assignments | 7 | ×6 | 42 |
| **Total Mass** | | | **104** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 20 |
| Functions | 1 |
| Longest Function | 8 lines |
| Avg LOC/Function | 8.00 |
| Median LOC/Function | 8.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 2.00 | 0 |
| Cognitive (SonarJS) | 3 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1486030 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 14 |
| Predictions Total | 14 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


