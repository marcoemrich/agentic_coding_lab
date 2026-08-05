# Analysis Report: 2026-08-04_22-50-39_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-sference

Generated: 2026-08-04T23:26:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | kimi-k3-sference |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2141s |
| Started | 2026-08-04T22:50:39+00:00 |
| Ended | 2026-08-04T23:26:22+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 232
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 429
- **Active tests**: 32
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (32 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-04_22-50-39_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-sference
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-04_22-50-39_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-sference

 ✓ src/claim-office.spec.ts  (32 tests) 1446ms

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  23:26:23
   Duration  1.63s (transform 40ms, setup 0ms, collect 43ms, tests 1.45s, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 71 | ×2 | 142 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 9 | ×5 | 45 |
| Assignments | 69 | ×6 | 414 |
| **Total Mass** | | | **694** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 190 |
| Functions | 22 |
| Longest Function | 18 lines |
| Avg LOC/Function | 4.14 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 3 | 1.42 | 0 |
| Cognitive (SonarJS) | 4 | 2.11 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7060864 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 32 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 30 |
| Predictions Total | 30 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


