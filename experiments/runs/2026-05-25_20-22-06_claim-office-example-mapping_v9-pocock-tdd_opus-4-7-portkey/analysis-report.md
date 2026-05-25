# Analysis Report: 2026-05-25_20-22-06_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey

Generated: 2026-05-25T20:31:57+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v9-pocock-tdd |
| Model | opus-4-7-portkey |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 589s |
| Started | 2026-05-25T20:22:06+00:00 |
| Ended | 2026-05-25T20:31:57+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, scenario.ts
- **Implementation LOC** (total): 214
- **Test file**: cli.spec.ts
- **Test file LOC**: 50
- **Active tests**: 0
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_20-22-06_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_20-22-06_claim-office-example-mapping_v9-pocock-tdd_opus-4-7-portkey

 ✓ src/scenario.spec.ts  (34 tests) 7ms
 ✓ src/cli.spec.ts  (2 tests) 737ms

 Test Files  2 passed (2)
      Tests  36 passed (36)
   Start at  20:31:58
   Duration  1.06s (transform 44ms, setup 0ms, collect 50ms, tests 744ms, environment 0ms, prepare 94ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 10 | ×5 | 50 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **631** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 182 |
| Functions | 14 |
| Longest Function | 26 lines |
| Avg LOC/Function | 9.00 |
| Median LOC/Function | 7.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 0 |
| **Total** | **13** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.50 | 0 |
| Cognitive (SonarJS) | 7 | 3.30 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12176450 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 15.35s |
| Avg Red Phase | 11.04s |
| Avg Green Phase | 4.31s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 40 |
| Predictions Total | 40 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


