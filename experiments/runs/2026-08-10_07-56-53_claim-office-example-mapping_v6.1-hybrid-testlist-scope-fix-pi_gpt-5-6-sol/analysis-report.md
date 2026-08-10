# Analysis Report: 2026-08-10_07-56-53_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix-pi_gpt-5-6-sol

Generated: 2026-08-10T08:17:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1259s |
| Started | 2026-08-10T07:56:53+00:00 |
| Ended | 2026-08-10T08:17:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 108
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 188
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_07-56-53_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_07-56-53_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (35 tests) 10ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  08:17:54
   Duration  318ms (transform 54ms, setup 0ms, collect 60ms, tests 10ms, environment 0ms, prepare 101ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 80% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 40 | ×2 | 80 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 7 | ×5 | 35 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **507** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 102 |
| Functions | 4 |
| Longest Function | 22 lines |
| Avg LOC/Function | 13.25 |
| Median LOC/Function | 14.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **11** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.90 | 0 |
| Cognitive (SonarJS) | 5 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5884090 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 34 |
| Predictions Total | 34 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


