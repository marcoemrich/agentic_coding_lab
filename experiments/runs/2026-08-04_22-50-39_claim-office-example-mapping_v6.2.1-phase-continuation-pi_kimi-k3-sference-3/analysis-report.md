# Analysis Report: 2026-08-04_22-50-39_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-sference-3

Generated: 2026-08-04T23:23:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | kimi-k3-sference |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1953s |
| Started | 2026-08-04T22:50:39+00:00 |
| Ended | 2026-08-04T23:23:14+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 281
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 336
- **Active tests**: 31
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (31 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-04_22-50-39_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-sference-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-04_22-50-39_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-sference-3

 ✓ src/claim-office.spec.ts  (31 tests) 396ms

 Test Files  1 passed (1)
      Tests  31 passed (31)
   Start at  23:23:15
   Duration  560ms (transform 36ms, setup 0ms, collect 35ms, tests 396ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 84% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 12 | ×5 | 60 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **653** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 247 |
| Functions | 22 |
| Longest Function | 23 lines |
| Avg LOC/Function | 4.82 |
| Median LOC/Function | 3.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 4 | 1.53 | 0 |
| Cognitive (SonarJS) | 3 | 1.58 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9193545 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 45 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 34 |
| Predictions Total | 34 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


