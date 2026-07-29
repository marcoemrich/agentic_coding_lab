# Analysis Report: 2026-07-29_03-13-25_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-nebius-no-thinking

Generated: 2026-07-29T04:45:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | kimi-k3-nebius-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 5520s |
| Started | 2026-07-29T03:13:25+00:00 |
| Ended | 2026-07-29T04:45:26+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 310
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 463
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-29_03-13-25_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-nebius-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-29_03-13-25_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-nebius-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests) 488ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  04:45:27
   Duration  658ms (transform 44ms, setup 0ms, collect 45ms, tests 488ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 84% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 69 | ×2 | 138 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 13 | ×5 | 65 |
| Assignments | 76 | ×6 | 456 |
| **Total Mass** | | | **764** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 248 |
| Functions | 24 |
| Longest Function | 25 lines |
| Avg LOC/Function | 4.75 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.70 | 0 |
| Cognitive (SonarJS) | 5 | 1.92 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9444610 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 55 |
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


