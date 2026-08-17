# Analysis Report: 2026-08-17_14-15-14_claim-office-example-mapping_basic-sol-tdd-app-measured-model-pi_gpt-5-6-sol-codex

Generated: 2026-08-17T14:30:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-app-measured-model-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 915s |
| Started | 2026-08-17T14:15:14+00:00 |
| Ended | 2026-08-17T14:30:31+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 154
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 195
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_14-15-14_claim-office-example-mapping_basic-sol-tdd-app-measured-model-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_14-15-14_claim-office-example-mapping_basic-sol-tdd-app-measured-model-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (30 tests) 413ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  14:30:32
   Duration  596ms (transform 42ms, setup 0ms, collect 39ms, tests 413ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 55 | ×2 | 110 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 8 | ×5 | 40 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **569** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 135 |
| Functions | 10 |
| Longest Function | 16 lines |
| Avg LOC/Function | 6.00 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 5 | 1.81 | 0 |
| Cognitive (SonarJS) | 4 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4797115 |
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
| Predictions Correct | 23 |
| Predictions Total | 24 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 30 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


