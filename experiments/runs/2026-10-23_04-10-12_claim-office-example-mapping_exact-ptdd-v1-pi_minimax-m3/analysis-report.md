# Analysis Report: 2026-10-23_04-10-12_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3

Generated: 2026-10-23T04:20:50+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | minimax-m3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 633s |
| Started | 2026-10-23T04:10:13+00:00 |
| Ended | 2026-10-23T04:20:50+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, quote.ts
- **Implementation LOC** (total): 53
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 149
- **Active tests**: 5
- **Remaining todos**: 43

## Test Results

**Status**: ✅ All tests passing (5 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_04-10-12_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_04-10-12_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3

 ✓ src/claim-office.spec.ts  (48 tests | 43 skipped) 3ms

 Test Files  1 passed (1)
      Tests  5 passed | 43 todo (48)
   Start at  04:20:51
   Duration  298ms (transform 65ms, setup 0ms, collect 47ms, tests 3ms, environment 0ms, prepare 80ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 62% |
| Branches | 60% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 4 | ×2 | 8 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 0 | ×5 | 0 |
| Assignments | 8 | ×6 | 48 |
| **Total Mass** | | | **98** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 45 |
| Functions | 2 |
| Longest Function | 5 lines |
| Avg LOC/Function | 4.00 |
| Median LOC/Function | 4.00 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 3 | 2.00 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1310194 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 9 |
| Predictions Total | 9 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


