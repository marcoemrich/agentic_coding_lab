# Analysis Report: 2026-07-24_21-00-58_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3

Generated: 2026-07-25T20:29:52+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | minimax-m3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 7206s |
| Started | 2026-07-24T21:00:58+00:00 |
| Ended | 2026-07-24T23:01:05+00:00 |

## Code Metrics

- **Implementation files**: quote.ts, types.ts
- **Implementation LOC** (total): 165
- **Test file**: policy.spec.ts
- **Test file LOC**: 21
- **Active tests**: 0
- **Remaining todos**: 6

## Test Results

**Status**: ✅ All tests passing (23 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_21-00-58_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_21-00-58_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3

 ↓ src/scenario.spec.ts  (8 tests | 8 skipped)
 ↓ src/policy.spec.ts  (6 tests | 6 skipped)
 ↓ src/claim.spec.ts  (14 tests | 14 skipped)
 ✓ src/quote.spec.ts  (24 tests | 1 skipped) 5ms

 Test Files  1 passed | 3 skipped (4)
      Tests  23 passed | 29 todo (52)
   Start at  20:29:58
   Duration  529ms (transform 100ms, setup 0ms, collect 108ms, tests 5ms, environment 1ms, prepare 402ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 43 | ×1 | 43 |
| Invocations | 28 | ×2 | 56 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 4 | ×5 | 20 |
| Assignments | 37 | ×6 | 222 |
| **Total Mass** | | | **365** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 131 |
| Functions | 9 |
| Longest Function | 22 lines |
| Avg LOC/Function | 5.11 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 5 | 2.50 | 0 |
| Cognitive (SonarJS) | 6 | 2.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11194178 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 21 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 36 |
| Predictions Total | 36 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


