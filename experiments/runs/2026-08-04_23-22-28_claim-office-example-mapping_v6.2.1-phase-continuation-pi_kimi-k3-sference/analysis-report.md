# Analysis Report: 2026-08-04_23-22-28_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-sference

Generated: 2026-08-04T23:43:27+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | kimi-k3-sference |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1258s |
| Started | 2026-08-04T23:22:28+00:00 |
| Ended | 2026-08-04T23:43:27+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 252
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 559
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-04_23-22-28_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-sference
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-04_23-22-28_claim-office-example-mapping_v6.2.1-phase-continuation-pi_kimi-k3-sference

 ✓ src/claim-office.spec.ts  (36 tests) 595ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  23:43:27
   Duration  771ms (transform 45ms, setup 1ms, collect 40ms, tests 595ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 74 | ×2 | 148 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 7 | ×5 | 35 |
| Assignments | 67 | ×6 | 402 |
| **Total Mass** | | | **691** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 205 |
| Functions | 23 |
| Longest Function | 19 lines |
| Avg LOC/Function | 5.00 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 4 | 1.60 | 0 |
| Cognitive (SonarJS) | 3 | 1.53 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8117737 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 53 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 39 |
| Predictions Total | 39 |
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


