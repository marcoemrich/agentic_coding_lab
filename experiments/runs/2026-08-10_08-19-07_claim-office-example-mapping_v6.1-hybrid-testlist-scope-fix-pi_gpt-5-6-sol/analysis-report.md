# Analysis Report: 2026-08-10_08-19-07_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix-pi_gpt-5-6-sol

Generated: 2026-08-10T08:34:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 918s |
| Started | 2026-08-10T08:19:07+00:00 |
| Ended | 2026-08-10T08:34:26+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 71
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 101
- **Active tests**: 21
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (21 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_08-19-07_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_08-19-07_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (21 tests) 5ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  08:34:27
   Duration  174ms (transform 39ms, setup 0ms, collect 35ms, tests 5ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 77% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 41 | ×2 | 82 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 7 | ×5 | 35 |
| Assignments | 35 | ×6 | 210 |
| **Total Mass** | | | **438** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 67 |
| Functions | 3 |
| Longest Function | 22 lines |
| Avg LOC/Function | 12.00 |
| Median LOC/Function | 12.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 0 |
| **Total** | **14** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.62 | 0 |
| Cognitive (SonarJS) | 4 | 2.22 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3368221 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 22 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 24 |
| Predictions Total | 26 |
| Accuracy | 92% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


