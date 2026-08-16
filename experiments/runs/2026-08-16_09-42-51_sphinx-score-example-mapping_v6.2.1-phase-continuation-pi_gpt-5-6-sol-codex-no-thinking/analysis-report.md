# Analysis Report: 2026-08-16_09-42-51_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex-no-thinking

Generated: 2026-08-16T09:54:17+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | sphinx-score-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | gpt-5-6-sol-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 685s |
| Started | 2026-08-16T09:42:51+00:00 |
| Ended | 2026-08-16T09:54:17+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, sphinx-score.ts
- **Implementation LOC** (total): 40
- **Test file**: sphinx-score.spec.ts
- **Test file LOC**: 114
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_09-42-51_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_09-42-51_sphinx-score-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex-no-thinking

 ✓ src/sphinx-score.spec.ts  (12 tests) 350ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  09:54:18
   Duration  500ms (transform 24ms, setup 0ms, collect 24ms, tests 350ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 77% |
| Branches | 83% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 9 | ×2 | 18 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 1 | ×5 | 5 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **114** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 33 |
| Functions | 1 |
| Longest Function | 10 lines |
| Avg LOC/Function | 10.00 |
| Median LOC/Function | 10.00 |
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
| McCabe (Cyclomatic) | 2 | 1.33 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1635681 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 17 |
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


