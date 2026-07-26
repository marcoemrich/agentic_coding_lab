# Analysis Report: 2026-07-26_15-11-38_claim-office-example-mapping_v6.2.1-phase-continuation-cursor_opus-cursor

Generated: 2026-07-26T15:28:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-cursor |
| Model | opus-cursor |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1001s |
| Started | 2026-07-26T15:11:38+00:00 |
| Ended | 2026-07-26T15:28:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 248
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 658
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-26_15-11-38_claim-office-example-mapping_v6.2.1-phase-continuation-cursor_opus-cursor
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-26_15-11-38_claim-office-example-mapping_v6.2.1-phase-continuation-cursor_opus-cursor

 ✓ src/claim-office.spec.ts  (43 tests) 7ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  15:28:20
   Duration  253ms (transform 66ms, setup 1ms, collect 75ms, tests 7ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 62 | ×2 | 124 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 10 | ×5 | 50 |
| Assignments | 78 | ×6 | 468 |
| **Total Mass** | | | **767** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 219 |
| Functions | 15 |
| Longest Function | 20 lines |
| Avg LOC/Function | 8.33 |
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
| McCabe (Cyclomatic) | 6 | 2.04 | 0 |
| Cognitive (SonarJS) | 7 | 3.22 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15590927 |
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
| Predictions Correct | 77 |
| Predictions Total | 78 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


