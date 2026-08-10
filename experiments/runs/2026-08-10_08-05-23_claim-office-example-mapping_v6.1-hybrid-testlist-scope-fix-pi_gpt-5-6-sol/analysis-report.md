# Analysis Report: 2026-08-10_08-05-23_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix-pi_gpt-5-6-sol

Generated: 2026-08-10T08:23:09+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1065s |
| Started | 2026-08-10T08:05:23+00:00 |
| Ended | 2026-08-10T08:23:09+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 98
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 139
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_08-05-23_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_08-05-23_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (34 tests) 8ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  08:23:10
   Duration  291ms (transform 84ms, setup 0ms, collect 76ms, tests 8ms, environment 0ms, prepare 89ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 82% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 45 | ×2 | 90 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 6 | ×5 | 30 |
| Assignments | 36 | ×6 | 216 |
| **Total Mass** | | | **442** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 89 |
| Functions | 6 |
| Longest Function | 32 lines |
| Avg LOC/Function | 10.17 |
| Median LOC/Function | 6.50 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **16** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 2.29 | 0 |
| Cognitive (SonarJS) | 3 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4177129 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


