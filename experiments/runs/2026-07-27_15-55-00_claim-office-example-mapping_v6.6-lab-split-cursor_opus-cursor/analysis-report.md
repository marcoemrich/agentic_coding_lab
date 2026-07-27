# Analysis Report: 2026-07-27_15-55-00_claim-office-example-mapping_v6.6-lab-split-cursor_opus-cursor

Generated: 2026-07-27T16:06:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-cursor |
| Model | opus-cursor |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 661s |
| Started | 2026-07-27T15:55:00+00:00 |
| Ended | 2026-07-27T16:06:02+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 227
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 211
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-27_15-55-00_claim-office-example-mapping_v6.6-lab-split-cursor_opus-cursor
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-27_15-55-00_claim-office-example-mapping_v6.6-lab-split-cursor_opus-cursor

 ✓ src/claim-office.spec.ts  (44 tests) 9ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  16:06:03
   Duration  165ms (transform 34ms, setup 0ms, collect 33ms, tests 9ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 70% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 64 | ×2 | 128 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 6 | ×5 | 30 |
| Assignments | 75 | ×6 | 450 |
| **Total Mass** | | | **739** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 191 |
| Functions | 14 |
| Longest Function | 29 lines |
| Avg LOC/Function | 8.43 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 6 | 2.00 | 0 |
| Cognitive (SonarJS) | 6 | 3.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7665573 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 24 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 18 |
| Predictions Total | 18 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


