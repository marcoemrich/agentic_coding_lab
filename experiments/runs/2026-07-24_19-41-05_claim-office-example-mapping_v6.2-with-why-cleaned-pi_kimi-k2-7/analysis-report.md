# Analysis Report: 2026-07-24_19-41-05_claim-office-example-mapping_v6.2-with-why-cleaned-pi_kimi-k2-7

Generated: 2026-07-25T13:03:26+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | kimi-k2-7 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 3122s |
| Started | 2026-07-24T19:41:05+00:00 |
| Ended | 2026-07-24T20:33:08+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 301
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 273
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_19-41-05_claim-office-example-mapping_v6.2-with-why-cleaned-pi_kimi-k2-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_19-41-05_claim-office-example-mapping_v6.2-with-why-cleaned-pi_kimi-k2-7

 ✓ src/claim-office.spec.ts  (30 tests) 5ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  13:03:27
   Duration  377ms (transform 31ms, setup 0ms, collect 33ms, tests 5ms, environment 0ms, prepare 70ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 66% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 8 | ×5 | 40 |
| Assignments | 102 | ×6 | 612 |
| **Total Mass** | | | **939** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 252 |
| Functions | 28 |
| Longest Function | 21 lines |
| Avg LOC/Function | 4.50 |
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
| McCabe (Cyclomatic) | 5 | 1.60 | 0 |
| Cognitive (SonarJS) | 6 | 1.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13050493 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 30 |
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


