# Analysis Report: 2026-07-24_15-24-24_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-2

Generated: 2026-07-24T15:55:37+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | opus-4-8 |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 1871s |
| Started | 2026-07-24T15:24:24+00:00 |
| Ended | 2026-07-24T15:55:37+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 287
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 653
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_15-24-24_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_15-24-24_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-2

 ✓ src/claim-office.spec.ts  (41 tests) 861ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  15:55:38
   Duration  1.04s (transform 55ms, setup 0ms, collect 54ms, tests 861ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 81 | ×2 | 162 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 9 | ×5 | 45 |
| Assignments | 87 | ×6 | 522 |
| **Total Mass** | | | **866** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 243 |
| Functions | 24 |
| Longest Function | 18 lines |
| Avg LOC/Function | 5.71 |
| Median LOC/Function | 4.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 1.71 | 0 |
| Cognitive (SonarJS) | 6 | 2.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1482547 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 35 |
| Predictions Total | 36 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


