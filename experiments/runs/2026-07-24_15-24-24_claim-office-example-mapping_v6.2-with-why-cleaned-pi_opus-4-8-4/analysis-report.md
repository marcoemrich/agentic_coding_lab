# Analysis Report: 2026-07-24_15-24-24_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-4

Generated: 2026-07-24T15:48:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | opus-4-8 |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 1435s |
| Started | 2026-07-24T15:24:24+00:00 |
| Ended | 2026-07-24T15:48:21+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 265
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 357
- **Active tests**: 32
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (32 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_15-24-24_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_15-24-24_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-4

 ✓ src/claim-office.spec.ts  (32 tests) 6ms

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  15:48:22
   Duration  168ms (transform 36ms, setup 0ms, collect 35ms, tests 6ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 10 | ×5 | 50 |
| Assignments | 79 | ×6 | 474 |
| **Total Mass** | | | **796** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 214 |
| Functions | 19 |
| Longest Function | 25 lines |
| Avg LOC/Function | 6.74 |
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
| McCabe (Cyclomatic) | 3 | 1.64 | 0 |
| Cognitive (SonarJS) | 3 | 1.71 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1208517 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 32 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 65 |
| Predictions Total | 65 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


