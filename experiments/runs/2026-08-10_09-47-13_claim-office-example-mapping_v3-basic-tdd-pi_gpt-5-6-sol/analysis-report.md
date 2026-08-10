# Analysis Report: 2026-08-10_09-47-13_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol

Generated: 2026-08-10T09:50:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 180s |
| Started | 2026-08-10T09:47:13+00:00 |
| Ended | 2026-08-10T09:50:14+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 153
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 80
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_09-47-13_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_09-47-13_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (10 tests) 4ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  09:50:15
   Duration  175ms (transform 31ms, setup 0ms, collect 31ms, tests 4ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 77% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 85 | ×1 | 85 |
| Invocations | 100 | ×2 | 200 |
| Conditionals | 27 | ×4 | 108 |
| Loops | 9 | ×5 | 45 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **708** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 130 |
| Functions | 9 |
| Longest Function | 34 lines |
| Avg LOC/Function | 10.00 |
| Median LOC/Function | 4.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 15 | 5.78 | 2 |
| Cognitive (SonarJS) | 18 | 7.14 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 188818 |
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


