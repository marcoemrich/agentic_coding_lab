# Analysis Report: 2026-08-04_21-08-07_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-sference

Generated: 2026-08-04T21:48:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | kimi-k3-sference |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2411s |
| Started | 2026-08-04T21:08:07+00:00 |
| Ended | 2026-08-04T21:48:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 197
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 375
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-04_21-08-07_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-sference
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-04_21-08-07_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-sference

 ✓ src/claim-office.spec.ts  (35 tests) 1756ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  21:48:21
   Duration  1.95s (transform 45ms, setup 0ms, collect 51ms, tests 1.76s, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 59 | ×2 | 118 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 10 | ×5 | 50 |
| Assignments | 63 | ×6 | 378 |
| **Total Mass** | | | **652** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 160 |
| Functions | 19 |
| Longest Function | 17 lines |
| Avg LOC/Function | 4.68 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 3 | 1.56 | 0 |
| Cognitive (SonarJS) | 3 | 1.58 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11057115 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 38 |
| Predictions Total | 40 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


