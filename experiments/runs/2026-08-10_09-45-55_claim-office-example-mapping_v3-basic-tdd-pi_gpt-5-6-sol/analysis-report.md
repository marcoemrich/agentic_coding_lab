# Analysis Report: 2026-08-10_09-45-55_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol

Generated: 2026-08-11T23:15:24+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 154s |
| Started | 2026-08-10T09:45:55+00:00 |
| Ended | 2026-08-10T09:48:31+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 165
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 56
- **Active tests**: 4
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (4 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-10_09-45-55_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-10_09-45-55_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (4 tests) 5ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  23:15:25
   Duration  768ms (transform 78ms, setup 0ms, collect 65ms, tests 5ms, environment 0ms, prepare 285ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 80% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 74 | ×1 | 74 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 9 | ×5 | 45 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **705** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 150 |
| Functions | 11 |
| Longest Function | 20 lines |
| Avg LOC/Function | 7.55 |
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
| McCabe (Cyclomatic) | 6 | 2.74 | 0 |
| Cognitive (SonarJS) | 8 | 2.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 157812 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


