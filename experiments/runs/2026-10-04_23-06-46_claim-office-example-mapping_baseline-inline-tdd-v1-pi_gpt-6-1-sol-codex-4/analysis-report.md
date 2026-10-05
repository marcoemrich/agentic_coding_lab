# Analysis Report: 2026-10-04_23-06-46_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex-4

Generated: 2026-10-04T23:14:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-1-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 462s |
| Started | 2026-10-04T23:06:48+00:00 |
| Ended | 2026-10-04T23:14:36+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts, validation.ts
- **Implementation LOC** (total): 159
- **Test files**: cli.spec.ts, office.spec.ts
- **Test LOC** (total): 232
- **Active tests**: 27
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (74 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-04_23-06-46_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-04_23-06-46_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex-4

 ✓ src/office.spec.ts  (66 tests) 12ms
 ✓ src/cli.spec.ts  (8 tests) 1366ms

 Test Files  2 passed (2)
      Tests  74 passed (74)
   Start at  23:14:37
   Duration  1.91s (transform 77ms, setup 0ms, collect 94ms, tests 1.38s, environment 0ms, prepare 156ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 101 | ×1 | 101 |
| Invocations | 85 | ×2 | 170 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 9 | ×5 | 45 |
| Assignments | 34 | ×6 | 204 |
| **Total Mass** | | | **612** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 142 |
| Functions | 12 |
| Longest Function | 18 lines |
| Avg LOC/Function | 7.67 |
| Median LOC/Function | 7.50 |
| Imports | 4 |

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
| McCabe (Cyclomatic) | 5 | 2.61 | 0 |
| Cognitive (SonarJS) | 7 | 3.09 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 907790 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


