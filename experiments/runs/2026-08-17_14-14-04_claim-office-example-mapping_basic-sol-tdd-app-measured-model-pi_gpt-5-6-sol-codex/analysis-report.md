# Analysis Report: 2026-08-17_14-14-04_claim-office-example-mapping_basic-sol-tdd-app-measured-model-pi_gpt-5-6-sol-codex

Generated: 2026-08-17T14:31:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-app-measured-model-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1046s |
| Started | 2026-08-17T14:14:04+00:00 |
| Ended | 2026-08-17T14:31:31+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 172
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 218
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_14-14-04_claim-office-example-mapping_basic-sol-tdd-app-measured-model-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_14-14-04_claim-office-example-mapping_basic-sol-tdd-app-measured-model-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (34 tests) 1781ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  14:31:32
   Duration  1.95s (transform 42ms, setup 0ms, collect 42ms, tests 1.78s, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 58 | ×2 | 116 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 7 | ×5 | 35 |
| Assignments | 43 | ×6 | 258 |
| **Total Mass** | | | **528** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 151 |
| Functions | 12 |
| Longest Function | 18 lines |
| Avg LOC/Function | 6.58 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 3 | 1.59 | 0 |
| Cognitive (SonarJS) | 2 | 1.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6472889 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 27 |
| Predictions Total | 28 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 34 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


