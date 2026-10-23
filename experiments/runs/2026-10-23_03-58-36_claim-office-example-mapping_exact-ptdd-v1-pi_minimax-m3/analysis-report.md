# Analysis Report: 2026-10-23_03-58-36_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3

Generated: 2026-10-23T04:32:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | minimax-m3 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2021s |
| Started | 2026-10-23T03:58:37+00:00 |
| Ended | 2026-10-23T04:32:22+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, domain.ts, policy.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 421
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 691
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (49 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_03-58-36_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_03-58-36_claim-office-example-mapping_exact-ptdd-v1-pi_minimax-m3

 ✓ src/claim-office.spec.ts  (49 tests) 217ms

 Test Files  1 passed (1)
      Tests  49 passed (49)
   Start at  04:32:23
   Duration  562ms (transform 95ms, setup 0ms, collect 103ms, tests 217ms, environment 0ms, prepare 86ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 93 | ×1 | 93 |
| Invocations | 114 | ×2 | 228 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 12 | ×5 | 60 |
| Assignments | 77 | ×6 | 462 |
| **Total Mass** | | | **927** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 340 |
| Functions | 22 |
| Longest Function | 24 lines |
| Avg LOC/Function | 7.95 |
| Median LOC/Function | 6.50 |
| Imports | 17 |

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
| McCabe (Cyclomatic) | 7 | 2.52 | 0 |
| Cognitive (SonarJS) | 9 | 2.76 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2189088 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 49 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 8 |
| Predictions Total | 8 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


