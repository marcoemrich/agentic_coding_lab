# Analysis Report: 2026-10-23_04-02-27_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash

Generated: 2026-10-23T04:12:39+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | deepseek-v4-1-flash |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 607s |
| Started | 2026-10-23T04:02:29+00:00 |
| Ended | 2026-10-23T04:12:39+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 355
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 376
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_04-02-27_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_04-02-27_claim-office-example-mapping_exact-ptdd-v1-pi_deepseek-v4-1-flash

 ✓ src/claim-office.spec.ts  (44 tests) 498ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  04:12:40
   Duration  789ms (transform 73ms, setup 0ms, collect 79ms, tests 498ms, environment 0ms, prepare 65ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 124 | ×2 | 248 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 11 | ×5 | 55 |
| Assignments | 58 | ×6 | 348 |
| **Total Mass** | | | **780** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 301 |
| Functions | 32 |
| Longest Function | 33 lines |
| Avg LOC/Function | 5.69 |
| Median LOC/Function | 3.00 |
| Imports | 9 |

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
| McCabe (Cyclomatic) | 4 | 1.66 | 0 |
| Cognitive (SonarJS) | 4 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6772850 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 60 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 120 |
| Predictions Total | 122 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 55 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


