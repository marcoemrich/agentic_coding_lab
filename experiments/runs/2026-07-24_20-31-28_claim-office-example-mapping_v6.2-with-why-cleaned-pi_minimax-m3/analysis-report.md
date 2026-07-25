# Analysis Report: 2026-07-24_20-31-28_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3

Generated: 2026-07-25T13:03:58+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | minimax-m3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 7206s |
| Started | 2026-07-24T20:31:28+00:00 |
| Ended | 2026-07-24T22:31:35+00:00 |

## Code Metrics

- **Implementation files**: office.ts
- **Implementation LOC** (total): 241
- **Test file**: office.spec.ts
- **Test file LOC**: 220
- **Active tests**: 33
- **Remaining todos**: 12

## Test Results

**Status**: ✅ All tests passing (33 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_20-31-28_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_20-31-28_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3

 ✓ src/office.spec.ts  (44 tests | 11 skipped) 6ms

 Test Files  1 passed (1)
      Tests  33 passed | 11 todo (44)
   Start at  13:04:03
   Duration  352ms (transform 32ms, setup 0ms, collect 32ms, tests 6ms, environment 0ms, prepare 106ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 98% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 76 | ×1 | 76 |
| Invocations | 72 | ×2 | 144 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 22 | ×5 | 110 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **752** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 167 |
| Functions | 16 |
| Longest Function | 19 lines |
| Avg LOC/Function | 7.19 |
| Median LOC/Function | 6.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.05 | 0 |
| Cognitive (SonarJS) | 7 | 2.27 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15505282 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 32 |
| Predictions Total | 32 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


