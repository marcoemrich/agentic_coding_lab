# Analysis Report: 2026-08-16_09-22-27_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex-no-thinking

Generated: 2026-08-16T09:34:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | gpt-5-6-sol-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 700s |
| Started | 2026-08-16T09:22:27+00:00 |
| Ended | 2026-08-16T09:34:08+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 24
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 119
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_09-22-27_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_09-22-27_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex-no-thinking

 ✓ src/sphinx-score.spec.ts  (12 tests) 361ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  09:34:09
   Duration  514ms (transform 24ms, setup 0ms, collect 23ms, tests 361ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 79% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 10 | ×2 | 20 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 1 | ×5 | 5 |
| Assignments | 7 | ×6 | 42 |
| **Total Mass** | | | **89** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 21 |
| Functions | 1 |
| Longest Function | 14 lines |
| Avg LOC/Function | 14.00 |
| Median LOC/Function | 14.00 |
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
| McCabe (Cyclomatic) | 3 | 1.50 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1695058 |
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
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


