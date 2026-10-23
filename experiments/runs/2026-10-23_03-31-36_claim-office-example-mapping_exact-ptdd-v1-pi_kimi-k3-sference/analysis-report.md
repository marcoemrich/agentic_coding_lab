# Analysis Report: 2026-10-23_03-31-36_claim-office-example-mapping_exact-ptdd-v1-pi_kimi-k3-sference

Generated: 2026-10-23T03:44:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | kimi-k3-sference |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 777s |
| Started | 2026-10-23T03:31:37+00:00 |
| Ended | 2026-10-23T03:44:38+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, cli.ts
- **Implementation LOC** (total): 202
- **Test files**: claimOffice.spec.ts
- **Test LOC** (total): 454
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_03-31-36_claim-office-example-mapping_exact-ptdd-v1-pi_kimi-k3-sference
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_03-31-36_claim-office-example-mapping_exact-ptdd-v1-pi_kimi-k3-sference

 ✓ src/claimOffice.spec.ts  (42 tests) 4026ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  03:44:39
   Duration  4.47s (transform 104ms, setup 0ms, collect 118ms, tests 4.03s, environment 0ms, prepare 106ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 61 | ×2 | 122 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **548** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 180 |
| Functions | 10 |
| Longest Function | 18 lines |
| Avg LOC/Function | 8.60 |
| Median LOC/Function | 8.00 |
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
| McCabe (Cyclomatic) | 6 | 2.36 | 0 |
| Cognitive (SonarJS) | 7 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6874813 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 84 |
| Predictions Total | 84 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 42 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


