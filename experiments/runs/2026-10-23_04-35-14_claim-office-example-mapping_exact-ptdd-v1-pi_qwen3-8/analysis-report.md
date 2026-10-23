# Analysis Report: 2026-10-23_04-35-14_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8

Generated: 2026-10-23T04:44:39+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | qwen3-8 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 561s |
| Started | 2026-10-23T04:35:15+00:00 |
| Ended | 2026-10-23T04:44:39+00:00 |

## Code Metrics

- **Implementation files**: amounts.ts, claim.ts, cli.ts, price-list.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 283
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 336
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_04-35-14_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_04-35-14_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8

 ✓ src/claim-office.spec.ts  (39 tests) 976ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  04:44:40
   Duration  1.28s (transform 84ms, setup 0ms, collect 89ms, tests 976ms, environment 0ms, prepare 79ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 98 | ×1 | 98 |
| Invocations | 103 | ×2 | 206 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 10 | ×5 | 50 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **738** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 231 |
| Functions | 20 |
| Longest Function | 18 lines |
| Avg LOC/Function | 6.60 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 5 | 1.97 | 0 |
| Cognitive (SonarJS) | 6 | 2.23 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8241912 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
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
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


