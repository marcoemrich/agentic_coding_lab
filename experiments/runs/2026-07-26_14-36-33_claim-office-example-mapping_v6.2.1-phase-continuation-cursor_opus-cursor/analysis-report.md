# Analysis Report: 2026-07-26_14-36-33_claim-office-example-mapping_v6.2.1-phase-continuation-cursor_opus-cursor

Generated: 2026-07-26T14:50:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-cursor |
| Model | opus-cursor |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 836s |
| Started | 2026-07-26T14:36:33+00:00 |
| Ended | 2026-07-26T14:50:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 202
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 420
- **Active tests**: 32
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (32 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-26_14-36-33_claim-office-example-mapping_v6.2.1-phase-continuation-cursor_opus-cursor
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-26_14-36-33_claim-office-example-mapping_v6.2.1-phase-continuation-cursor_opus-cursor

 ✓ src/claim-office.spec.ts  (32 tests) 9ms

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  14:50:31
   Duration  222ms (transform 48ms, setup 0ms, collect 52ms, tests 9ms, environment 0ms, prepare 68ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 64 | ×2 | 128 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 9 | ×5 | 45 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **694** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 171 |
| Functions | 14 |
| Longest Function | 16 lines |
| Avg LOC/Function | 6.43 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 4 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.05 | 0 |
| Cognitive (SonarJS) | 6 | 2.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10914648 |
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
| Predictions Correct | 63 |
| Predictions Total | 63 |
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


