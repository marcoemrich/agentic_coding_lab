# Analysis Report: 2026-09-16_14-02-51_sphinx-score-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-pi_gpt-5-6-sol-codex

Generated: 2026-09-16T14:14:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | exact-sol-v1.5-tcr-parity-domain-trial-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 700s |
| Started | 2026-09-16T14:02:53+00:00 |
| Ended | 2026-09-16T14:14:36+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 61
- **Test files**: sphinx-score.spec.ts
- **Test LOC** (total): 110
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_14-02-51_sphinx-score-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_14-02-51_sphinx-score-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-pi_gpt-5-6-sol-codex

 ✓ src/sphinx-score.spec.ts  (11 tests) 663ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  14:14:37
   Duration  1.04s (transform 55ms, setup 0ms, collect 58ms, tests 663ms, environment 0ms, prepare 118ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 24 | ×1 | 24 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 1 | ×5 | 5 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **159** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 50 |
| Functions | 5 |
| Longest Function | 9 lines |
| Avg LOC/Function | 5.40 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 2 | 1.38 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2038598 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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


