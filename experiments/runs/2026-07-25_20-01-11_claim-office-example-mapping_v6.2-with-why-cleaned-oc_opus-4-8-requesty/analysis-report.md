# Analysis Report: 2026-07-25_20-01-11_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-8-requesty

Generated: 2026-07-25T20:33:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-oc |
| Model | opus-4-8-requesty |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 1958s |
| Started | 2026-07-25T20:01:11+00:00 |
| Ended | 2026-07-25T20:33:50+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 260
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 383
- **Active tests**: 32
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (32 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_20-01-11_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-8-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_20-01-11_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-8-requesty

 ✓ src/claim-office.spec.ts  (32 tests) 6ms

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  20:33:51
   Duration  169ms (transform 37ms, setup 0ms, collect 36ms, tests 6ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 81 | ×2 | 162 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 15 | ×5 | 75 |
| Assignments | 91 | ×6 | 546 |
| **Total Mass** | | | **871** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 213 |
| Functions | 26 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.04 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.50 | 0 |
| Cognitive (SonarJS) | 4 | 1.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 26459386 |
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
| Predictions Correct | 64 |
| Predictions Total | 64 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


