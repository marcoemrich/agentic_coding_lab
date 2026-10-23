# Analysis Report: 2026-10-23_03-17-45_claim-office-example-mapping_exact-ptdd-v1-pi_kimi-k3-sference

Generated: 2026-10-23T03:49:37+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | kimi-k3-sference |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1908s |
| Started | 2026-10-23T03:17:46+00:00 |
| Ended | 2026-10-23T03:49:37+00:00 |

## Code Metrics

- **Implementation files**: catalogue.ts, claims.ts, cli.ts, premium.ts
- **Implementation LOC** (total): 238
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 691
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_03-17-45_claim-office-example-mapping_exact-ptdd-v1-pi_kimi-k3-sference
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_03-17-45_claim-office-example-mapping_exact-ptdd-v1-pi_kimi-k3-sference

 ✓ src/claim-office.spec.ts  (39 tests) 26307ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  03:49:38
   Duration  26.71s (transform 127ms, setup 0ms, collect 95ms, tests 26.31s, environment 0ms, prepare 96ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 66 | ×2 | 132 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 7 | ×5 | 35 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **619** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 216 |
| Functions | 10 |
| Longest Function | 30 lines |
| Avg LOC/Function | 12.10 |
| Median LOC/Function | 11.00 |
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
| McCabe (Cyclomatic) | 8 | 3.25 | 0 |
| Cognitive (SonarJS) | 9 | 4.88 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6808753 |
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
| Predictions Correct | 75 |
| Predictions Total | 75 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 39 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


