# Analysis Report: 2026-10-19_00-53-41_claim-office-example-mapping_exact-hybrid-v4.2-phase-continuation-pi_minimax-m3-2

Generated: 2026-10-19T02:16:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v4.2-phase-continuation-pi |
| Model | minimax-m3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4937s |
| Started | 2026-10-19T00:53:42+00:00 |
| Ended | 2026-10-19T02:16:02+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, types.ts
- **Implementation LOC** (total): 332
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts
- **Test LOC** (total): 337
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-19_00-53-41_claim-office-example-mapping_exact-hybrid-v4.2-phase-continuation-pi_minimax-m3-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-19_00-53-41_claim-office-example-mapping_exact-hybrid-v4.2-phase-continuation-pi_minimax-m3-2

 ✓ src/premium.spec.ts  (27 tests) 4ms
 ✓ src/claim.spec.ts  (14 tests) 4ms
 ✓ src/cli.spec.ts  (5 tests) 4ms

 Test Files  3 passed (3)
      Tests  46 passed (46)
   Start at  02:16:02
   Duration  451ms (transform 53ms, setup 0ms, collect 57ms, tests 12ms, environment 0ms, prepare 142ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 82 | ×1 | 82 |
| Invocations | 99 | ×2 | 198 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 15 | ×5 | 75 |
| Assignments | 65 | ×6 | 390 |
| **Total Mass** | | | **829** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 287 |
| Functions | 14 |
| Longest Function | 34 lines |
| Avg LOC/Function | 11.07 |
| Median LOC/Function | 9.50 |
| Imports | 5 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.62 | 0 |
| Cognitive (SonarJS) | 10 | 3.91 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14804346 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 46 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 20 |
| Predictions Total | 20 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


