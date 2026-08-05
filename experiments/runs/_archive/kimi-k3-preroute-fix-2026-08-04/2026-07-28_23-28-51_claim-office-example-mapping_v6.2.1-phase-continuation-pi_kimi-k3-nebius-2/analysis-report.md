# Analysis Report: 2026-07-28_23-28-51_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-nebius-2

Generated: 2026-07-29T01:55:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | kimi-k3-nebius |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 8804s |
| Started | 2026-07-28T23:28:51+00:00 |
| Ended | 2026-07-29T01:55:38+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 284
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 505
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-28_23-28-51_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-nebius-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-28_23-28-51_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-nebius-2

 ✓ src/claim-office.spec.ts  (38 tests) 611ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  01:55:39
   Duration  782ms (transform 40ms, setup 0ms, collect 41ms, tests 611ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 101 | ×2 | 202 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 6 | ×5 | 30 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **648** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 237 |
| Functions | 29 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.90 |
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
| McCabe (Cyclomatic) | 4 | 1.51 | 0 |
| Cognitive (SonarJS) | 4 | 1.60 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1941602 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
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
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


