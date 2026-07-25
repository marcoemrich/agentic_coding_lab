# Analysis Report: 2026-07-25_20-17-27_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-8-requesty

Generated: 2026-07-25T21:14:19+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-oc |
| Model | opus-4-8-requesty |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 3410s |
| Started | 2026-07-25T20:17:27+00:00 |
| Ended | 2026-07-25T21:14:19+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 398
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 295
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_20-17-27_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-8-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_20-17-27_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-8-requesty

 ✓ src/claim-office.spec.ts  (40 tests) 6ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  21:14:19
   Duration  163ms (transform 35ms, setup 0ms, collect 34ms, tests 6ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 105 | ×2 | 210 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 13 | ×5 | 65 |
| Assignments | 100 | ×6 | 600 |
| **Total Mass** | | | **985** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 269 |
| Functions | 38 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.05 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 4 | 1.43 | 0 |
| Cognitive (SonarJS) | 4 | 1.60 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 47009694 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 80 |
| Predictions Total | 80 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 40 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


