# Analysis Report: 2026-08-10_07-49-29_claim-office-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol

Generated: 2026-08-10T07:53:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 230s |
| Started | 2026-08-10T07:49:29+00:00 |
| Ended | 2026-08-10T07:53:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 133
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 59
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_07-49-29_claim-office-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_07-49-29_claim-office-example-mapping_v5.1-testlist-scope-fix-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (39 tests) 825ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  07:53:21
   Duration  1.01s (transform 36ms, setup 0ms, collect 42ms, tests 825ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 50 | ×2 | 100 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 9 | ×5 | 45 |
| Assignments | 40 | ×6 | 240 |
| **Total Mass** | | | **509** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 114 |
| Functions | 8 |
| Longest Function | 22 lines |
| Avg LOC/Function | 9.50 |
| Median LOC/Function | 9.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 2.57 | 0 |
| Cognitive (SonarJS) | 9 | 3.12 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 512344 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 78 |
| Predictions Total | 78 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 40 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


