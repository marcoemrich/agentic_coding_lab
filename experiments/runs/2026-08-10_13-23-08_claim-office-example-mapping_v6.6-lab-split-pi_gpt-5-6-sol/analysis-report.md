# Analysis Report: 2026-08-10_13-23-08_claim-office-example-mapping_v6.6-lab-split-pi_gpt-5-6-sol

Generated: 2026-08-10T13:47:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1452s |
| Started | 2026-08-10T13:23:08+00:00 |
| Ended | 2026-08-10T13:47:23+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 104
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 137
- **Active tests**: 31
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (31 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_13-23-08_claim-office-example-mapping_v6.6-lab-split-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_13-23-08_claim-office-example-mapping_v6.6-lab-split-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (31 tests) 376ms

 Test Files  1 passed (1)
      Tests  31 passed (31)
   Start at  13:47:24
   Duration  538ms (transform 36ms, setup 0ms, collect 35ms, tests 376ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 39 | ×2 | 78 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 5 | ×5 | 25 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **466** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 98 |
| Functions | 4 |
| Longest Function | 27 lines |
| Avg LOC/Function | 9.50 |
| Median LOC/Function | 4.50 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 5 | 2.64 | 0 |
| Cognitive (SonarJS) | 4 | 2.43 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6157829 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 38 |
| Predictions Total | 38 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


