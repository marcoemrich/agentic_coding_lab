# Analysis Report: 2026-07-25_08-56-23_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k2-7

Generated: 2026-07-25T13:11:44+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | kimi-k2-7 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1698s |
| Started | 2026-07-25T08:56:23+00:00 |
| Ended | 2026-07-25T09:24:42+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 265
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 302
- **Active tests**: 33
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (33 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_08-56-23_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k2-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_08-56-23_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k2-7

 ✓ src/claim-office.spec.ts  (33 tests) 7ms

 Test Files  1 passed (1)
      Tests  33 passed (33)
   Start at  13:11:45
   Duration  384ms (transform 37ms, setup 0ms, collect 36ms, tests 7ms, environment 0ms, prepare 91ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 10 | ×5 | 50 |
| Assignments | 92 | ×6 | 552 |
| **Total Mass** | | | **863** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 229 |
| Functions | 22 |
| Longest Function | 20 lines |
| Avg LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 5 | 1.80 | 0 |
| Cognitive (SonarJS) | 6 | 2.23 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13728481 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 15 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 42 |
| Predictions Total | 42 |
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


