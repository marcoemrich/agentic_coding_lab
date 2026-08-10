# Analysis Report: 2026-08-10_06-39-55_claim-office-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol

Generated: 2026-08-10T07:40:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.1-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 3623s |
| Started | 2026-08-10T06:39:55+00:00 |
| Ended | 2026-08-10T07:40:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 295
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 522
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_06-39-55_claim-office-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_06-39-55_claim-office-example-mapping_v4.1-testlist-scope-fix-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (46 tests) 2462ms

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  07:40:27
   Duration  2.67s (transform 61ms, setup 0ms, collect 68ms, tests 2.46s, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 74% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 95 | ×1 | 95 |
| Invocations | 142 | ×2 | 284 |
| Conditionals | 36 | ×4 | 144 |
| Loops | 12 | ×5 | 60 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **895** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 253 |
| Functions | 30 |
| Longest Function | 41 lines |
| Avg LOC/Function | 5.70 |
| Median LOC/Function | 3.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 17 |
| Code Quality | 0 |
| **Total** | **18** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 2.28 | 0 |
| Cognitive (SonarJS) | 8 | 2.56 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10735563 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 78 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 68 |
| Predictions Total | 96 |
| Accuracy | 70% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


