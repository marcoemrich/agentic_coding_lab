# Analysis Report: 2026-07-29_01-55-55_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-nebius-no-thinking

Generated: 2026-07-29T03:55:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | kimi-k3-nebius-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 7203s |
| Started | 2026-07-29T01:55:55+00:00 |
| Ended | 2026-07-29T03:55:59+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 238
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 296
- **Active tests**: 22
- **Remaining todos**: 14

## Test Results

**Status**: ✅ All tests passing (22 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-29_01-55-55_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-nebius-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-29_01-55-55_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-nebius-no-thinking

 ✓ src/claim-office.spec.ts  (36 tests | 14 skipped) 117ms

 Test Files  1 passed (1)
      Tests  22 passed | 14 todo (36)
   Start at  03:56:01
   Duration  292ms (transform 37ms, setup 0ms, collect 38ms, tests 117ms, environment 0ms, prepare 53ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 54 | ×2 | 108 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 7 | ×5 | 35 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **619** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 203 |
| Functions | 13 |
| Longest Function | 13 lines |
| Avg LOC/Function | 3.69 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 5 | 1.62 | 0 |
| Cognitive (SonarJS) | 5 | 1.88 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1075708 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 28 |
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
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


