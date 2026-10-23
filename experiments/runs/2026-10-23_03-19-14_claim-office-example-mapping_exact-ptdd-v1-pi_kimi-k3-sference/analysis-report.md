# Analysis Report: 2026-10-23_03-19-14_claim-office-example-mapping_exact-ptdd-v1-pi_kimi-k3-sference

Generated: 2026-10-23T03:35:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | kimi-k3-sference |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 997s |
| Started | 2026-10-23T03:19:15+00:00 |
| Ended | 2026-10-23T03:35:55+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, premium.ts
- **Implementation LOC** (total): 179
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 360
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_03-19-14_claim-office-example-mapping_exact-ptdd-v1-pi_kimi-k3-sference
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_03-19-14_claim-office-example-mapping_exact-ptdd-v1-pi_kimi-k3-sference

 ✓ src/claim-office.spec.ts  (39 tests) 7976ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  03:35:56
   Duration  8.29s (transform 63ms, setup 0ms, collect 50ms, tests 7.98s, environment 0ms, prepare 81ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 61 | ×2 | 122 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 9 | ×5 | 45 |
| Assignments | 42 | ×6 | 252 |
| **Total Mass** | | | **546** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 162 |
| Functions | 10 |
| Longest Function | 18 lines |
| Avg LOC/Function | 6.10 |
| Median LOC/Function | 4.50 |
| Imports | 3 |

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
| McCabe (Cyclomatic) | 6 | 1.85 | 0 |
| Cognitive (SonarJS) | 8 | 3.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6042903 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 77 |
| Predictions Total | 77 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 37 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


