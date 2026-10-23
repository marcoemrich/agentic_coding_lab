# Analysis Report: 2026-10-19_00-53-41_claim-office-example-mapping_exact-hybrid-v4.2-phase-continuation-pi_minimax-m3-3

Generated: 2026-10-19T02:36:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v4.2-phase-continuation-pi |
| Model | minimax-m3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 6166s |
| Started | 2026-10-19T00:53:42+00:00 |
| Ended | 2026-10-19T02:36:31+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, scenario.ts
- **Implementation LOC** (total): 279
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 608
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_00-53-41_claim-office-example-mapping_exact-hybrid-v4.2-phase-continuation-pi_minimax-m3-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_00-53-41_claim-office-example-mapping_exact-hybrid-v4.2-phase-continuation-pi_minimax-m3-3

 ✓ src/claim-office.spec.ts  (46 tests) 7ms

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  02:36:32
   Duration  175ms (transform 46ms, setup 0ms, collect 40ms, tests 7ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 70 | ×1 | 70 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 10 | ×5 | 50 |
| Assignments | 81 | ×6 | 486 |
| **Total Mass** | | | **822** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 232 |
| Functions | 12 |
| Longest Function | 60 lines |
| Avg LOC/Function | 14.17 |
| Median LOC/Function | 8.50 |
| Imports | 3 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 2.71 | 1 |
| Cognitive (SonarJS) | 19 | 6.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15301981 |
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
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


