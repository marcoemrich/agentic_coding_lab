# Analysis Report: 2026-08-16_10-02-30_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex-no-thinking

Generated: 2026-08-16T10:15:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | gpt-5-6-sol-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 764s |
| Started | 2026-08-16T10:02:30+00:00 |
| Ended | 2026-08-16T10:15:15+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 36
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 111
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_10-02-30_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_10-02-30_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex-no-thinking

 ✓ src/sphinx-score.spec.ts  (11 tests) 352ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  10:15:16
   Duration  500ms (transform 24ms, setup 0ms, collect 22ms, tests 352ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 80% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 10 | ×1 | 10 |
| Invocations | 10 | ×2 | 20 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 2 | ×5 | 10 |
| Assignments | 14 | ×6 | 84 |
| **Total Mass** | | | **132** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 29 |
| Functions | 2 |
| Longest Function | 17 lines |
| Avg LOC/Function | 9.50 |
| Median LOC/Function | 9.50 |
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
| McCabe (Cyclomatic) | 3 | 1.50 | 0 |
| Cognitive (SonarJS) | 2 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1501570 |
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
| Predictions Correct | 14 |
| Predictions Total | 14 |
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


