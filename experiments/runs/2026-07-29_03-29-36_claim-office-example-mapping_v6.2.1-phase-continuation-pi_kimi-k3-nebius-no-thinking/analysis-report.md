# Analysis Report: 2026-07-29_03-29-36_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-nebius-no-thinking

Generated: 2026-07-29T04:55:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | kimi-k3-nebius-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 5155s |
| Started | 2026-07-29T03:29:36+00:00 |
| Ended | 2026-07-29T04:55:32+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 277
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 499
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-29_03-29-36_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-nebius-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-29_03-29-36_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-nebius-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 583ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  04:55:34
   Duration  760ms (transform 40ms, setup 0ms, collect 42ms, tests 583ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 84 | ×2 | 168 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 10 | ×5 | 50 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **670** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 236 |
| Functions | 21 |
| Longest Function | 13 lines |
| Avg LOC/Function | 5.67 |
| Median LOC/Function | 5.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 5 | 1.74 | 0 |
| Cognitive (SonarJS) | 5 | 1.91 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11964672 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 78 |
| Predictions Total | 78 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


