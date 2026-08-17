# Analysis Report: 2026-08-17_14-15-07_claim-office-example-mapping_basic-sol-tdd-app-measured-model-pi_gpt-5-6-sol-codex

Generated: 2026-08-17T14:29:57+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-app-measured-model-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 888s |
| Started | 2026-08-17T14:15:07+00:00 |
| Ended | 2026-08-17T14:29:57+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 144
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 204
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_14-15-07_claim-office-example-mapping_basic-sol-tdd-app-measured-model-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_14-15-07_claim-office-example-mapping_basic-sol-tdd-app-measured-model-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (30 tests) 1575ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  14:29:58
   Duration  1.75s (transform 44ms, setup 0ms, collect 42ms, tests 1.57s, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 50 | ×2 | 100 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 9 | ×5 | 45 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **543** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 132 |
| Functions | 8 |
| Longest Function | 23 lines |
| Avg LOC/Function | 8.75 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 5 | 2.00 | 0 |
| Cognitive (SonarJS) | 5 | 2.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4830935 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 30 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 30 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


