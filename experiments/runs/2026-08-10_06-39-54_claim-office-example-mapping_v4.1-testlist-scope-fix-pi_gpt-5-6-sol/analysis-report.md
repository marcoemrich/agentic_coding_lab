# Analysis Report: 2026-08-10_06-39-54_claim-office-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol

Generated: 2026-08-10T08:00:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.1-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4852s |
| Started | 2026-08-10T06:39:54+00:00 |
| Ended | 2026-08-10T08:00:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 296
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 879
- **Active tests**: 60
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (60 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_06-39-54_claim-office-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_06-39-54_claim-office-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (60 tests) 547ms

 Test Files  1 passed (1)
      Tests  60 passed (60)
   Start at  08:01:05
   Duration  768ms (transform 69ms, setup 0ms, collect 71ms, tests 547ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 105 | ×1 | 105 |
| Invocations | 74 | ×2 | 148 |
| Conditionals | 37 | ×4 | 148 |
| Loops | 4 | ×5 | 20 |
| Assignments | 16 | ×6 | 96 |
| **Total Mass** | | | **517** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 262 |
| Functions | 26 |
| Longest Function | 48 lines |
| Avg LOC/Function | 6.92 |
| Median LOC/Function | 3.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 31 |
| Code Quality | 0 |
| **Total** | **34** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 2.22 | 1 |
| Cognitive (SonarJS) | 14 | 3.45 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 20872763 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 103 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 95 |
| Predictions Total | 118 |
| Accuracy | 80% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


