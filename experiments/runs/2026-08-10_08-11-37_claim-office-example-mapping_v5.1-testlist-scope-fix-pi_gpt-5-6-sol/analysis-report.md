# Analysis Report: 2026-08-10_08-11-37_claim-office-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol

Generated: 2026-08-10T08:15:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 218s |
| Started | 2026-08-10T08:11:37+00:00 |
| Ended | 2026-08-10T08:15:16+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 131
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 70
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_08-11-37_claim-office-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_08-11-37_claim-office-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (34 tests) 8ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  08:15:17
   Duration  247ms (transform 44ms, setup 0ms, collect 43ms, tests 8ms, environment 0ms, prepare 76ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 56 | ×2 | 112 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 9 | ×5 | 45 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **540** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 116 |
| Functions | 9 |
| Longest Function | 24 lines |
| Avg LOC/Function | 8.89 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 14 |
| Code Quality | 0 |
| **Total** | **14** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 3.00 | 0 |
| Cognitive (SonarJS) | 9 | 3.86 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 122462 |
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
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


