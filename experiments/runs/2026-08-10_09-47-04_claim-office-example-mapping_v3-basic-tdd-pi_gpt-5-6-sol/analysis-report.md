# Analysis Report: 2026-08-10_09-47-04_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol

Generated: 2026-08-10T09:52:39+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 334s |
| Started | 2026-08-10T09:47:04+00:00 |
| Ended | 2026-08-10T09:52:39+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 221
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 150
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_09-47-04_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_09-47-04_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (13 tests) 6ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  09:52:40
   Duration  199ms (transform 42ms, setup 0ms, collect 43ms, tests 6ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 91 | ×1 | 91 |
| Invocations | 103 | ×2 | 206 |
| Conditionals | 25 | ×4 | 100 |
| Loops | 11 | ×5 | 55 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **818** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 197 |
| Functions | 18 |
| Longest Function | 16 lines |
| Avg LOC/Function | 7.11 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 6 | 2.48 | 0 |
| Cognitive (SonarJS) | 7 | 2.47 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 421243 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


