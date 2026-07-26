# Analysis Report: 2026-07-26_14-52-55_claim-office-example-mapping_v6.2.1-phase-continuation-cursor_opus-cursor-2

Generated: 2026-07-26T15:08:54+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-cursor |
| Model | opus-cursor |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 957s |
| Started | 2026-07-26T14:52:55+00:00 |
| Ended | 2026-07-26T15:08:54+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 229
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 498
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-26_14-52-55_claim-office-example-mapping_v6.2.1-phase-continuation-cursor_opus-cursor-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-26_14-52-55_claim-office-example-mapping_v6.2.1-phase-continuation-cursor_opus-cursor-2

 ✓ src/claim-office.spec.ts  (37 tests) 6ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  15:08:55
   Duration  177ms (transform 38ms, setup 0ms, collect 39ms, tests 6ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 64 | ×2 | 128 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 11 | ×5 | 55 |
| Assignments | 76 | ×6 | 456 |
| **Total Mass** | | | **763** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 200 |
| Functions | 15 |
| Longest Function | 18 lines |
| Avg LOC/Function | 8.80 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 6 | 2.08 | 0 |
| Cognitive (SonarJS) | 8 | 2.46 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13315487 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 56 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 96 |
| Predictions Total | 96 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


