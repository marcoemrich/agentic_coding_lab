# Analysis Report: 2026-09-16_14-04-46_sphinx-score-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-pi_gpt-5-6-sol-codex

Generated: 2026-09-16T14:15:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | exact-sol-v1.5-tcr-parity-domain-trial-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 625s |
| Started | 2026-09-16T14:04:47+00:00 |
| Ended | 2026-09-16T14:15:15+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 51
- **Test files**: sphinx-score.spec.ts
- **Test LOC** (total): 117
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_14-04-46_sphinx-score-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_14-04-46_sphinx-score-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-pi_gpt-5-6-sol-codex

 ✓ src/sphinx-score.spec.ts  (12 tests) 711ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  14:15:16
   Duration  1.05s (transform 74ms, setup 0ms, collect 65ms, tests 711ms, environment 0ms, prepare 90ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 72% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 12 | ×1 | 12 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 2 | ×5 | 10 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **152** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 41 |
| Functions | 5 |
| Longest Function | 9 lines |
| Avg LOC/Function | 4.80 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 2 | 1.29 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2418387 |
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
| Predictions Correct | 24 |
| Predictions Total | 24 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


