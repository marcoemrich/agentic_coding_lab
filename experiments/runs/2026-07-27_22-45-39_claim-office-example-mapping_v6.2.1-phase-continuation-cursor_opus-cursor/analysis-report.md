# Analysis Report: 2026-07-27_22-45-39_claim-office-example-mapping_v6.2.1-phase-continuation-cursor_opus-cursor

Generated: 2026-07-27T23:13:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-cursor |
| Model | opus-cursor |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1674s |
| Started | 2026-07-27T22:45:39+00:00 |
| Ended | 2026-07-27T23:13:34+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 229
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 512
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-27_22-45-39_claim-office-example-mapping_v6.2.1-phase-continuation-cursor_opus-cursor
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-27_22-45-39_claim-office-example-mapping_v6.2.1-phase-continuation-cursor_opus-cursor

 ✓ src/claim-office.spec.ts  (38 tests) 6ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  23:13:35
   Duration  179ms (transform 44ms, setup 0ms, collect 47ms, tests 6ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 61 | ×2 | 122 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 9 | ×5 | 45 |
| Assignments | 76 | ×6 | 456 |
| **Total Mass** | | | **732** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 197 |
| Functions | 17 |
| Longest Function | 18 lines |
| Avg LOC/Function | 5.82 |
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
| McCabe (Cyclomatic) | 5 | 1.67 | 0 |
| Cognitive (SonarJS) | 6 | 1.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3908314 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 31 |
| Predictions Total | 32 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


