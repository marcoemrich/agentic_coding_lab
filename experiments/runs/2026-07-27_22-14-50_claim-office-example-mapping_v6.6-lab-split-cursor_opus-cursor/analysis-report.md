# Analysis Report: 2026-07-27_22-14-50_claim-office-example-mapping_v6.6-lab-split-cursor_opus-cursor

Generated: 2026-07-27T22:45:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-cursor |
| Model | opus-cursor |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1832s |
| Started | 2026-07-27T22:14:50+00:00 |
| Ended | 2026-07-27T22:45:23+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 271
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 618
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-27_22-14-50_claim-office-example-mapping_v6.6-lab-split-cursor_opus-cursor
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-27_22-14-50_claim-office-example-mapping_v6.6-lab-split-cursor_opus-cursor

 ✓ src/claim-office.spec.ts  (40 tests) 6ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  22:45:24
   Duration  180ms (transform 43ms, setup 0ms, collect 43ms, tests 6ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 11 | ×5 | 55 |
| Assignments | 87 | ×6 | 522 |
| **Total Mass** | | | **835** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 222 |
| Functions | 29 |
| Longest Function | 16 lines |
| Avg LOC/Function | 3.66 |
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
| McCabe (Cyclomatic) | 4 | 1.40 | 0 |
| Cognitive (SonarJS) | 3 | 1.21 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7722727 |
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
| Predictions Correct | 54 |
| Predictions Total | 54 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


