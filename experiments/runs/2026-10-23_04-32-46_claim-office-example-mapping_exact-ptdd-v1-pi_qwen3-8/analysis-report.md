# Analysis Report: 2026-10-23_04-32-46_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8

Generated: 2026-10-23T04:52:41+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | qwen3-8 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1191s |
| Started | 2026-10-23T04:32:47+00:00 |
| Ended | 2026-10-23T04:52:41+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claim.ts, cli.ts, quote.ts, types.ts
- **Implementation LOC** (total): 283
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 573
- **Active tests**: 52
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_04-32-46_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_04-32-46_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8

 ✓ src/claim-office.spec.ts  (49 tests) 10ms
 ✓ src/cli.spec.ts  (3 tests) 449ms

 Test Files  2 passed (2)
      Tests  52 passed (52)
   Start at  04:52:42
   Duration  962ms (transform 82ms, setup 0ms, collect 85ms, tests 459ms, environment 0ms, prepare 149ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 88 | ×2 | 176 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 11 | ×5 | 55 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **679** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 249 |
| Functions | 16 |
| Longest Function | 24 lines |
| Avg LOC/Function | 8.25 |
| Median LOC/Function | 6.00 |
| Imports | 7 |

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
| McCabe (Cyclomatic) | 5 | 2.40 | 0 |
| Cognitive (SonarJS) | 7 | 3.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 22527206 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 74 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 172 |
| Predictions Total | 172 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 75 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


