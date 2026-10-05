# Analysis Report: 2026-10-04_23-06-46_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex

Generated: 2026-10-04T23:13:12+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-1-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 379s |
| Started | 2026-10-04T23:06:48+00:00 |
| Ended | 2026-10-04T23:13:12+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, input.ts, office.ts
- **Implementation LOC** (total): 130
- **Test files**: cli.spec.ts, office.spec.ts
- **Test LOC** (total): 155
- **Active tests**: 25
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (63 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-04_23-06-46_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-04_23-06-46_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex

 ✓ src/office.spec.ts  (49 tests) 9ms
 ✓ src/cli.spec.ts  (14 tests) 2372ms

 Test Files  2 passed (2)
      Tests  63 passed (63)
   Start at  23:13:13
   Duration  2.91s (transform 77ms, setup 0ms, collect 93ms, tests 2.38s, environment 0ms, prepare 161ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 53% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 89 | ×1 | 89 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 11 | ×5 | 55 |
| Assignments | 34 | ×6 | 204 |
| **Total Mass** | | | **592** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 120 |
| Functions | 9 |
| Longest Function | 29 lines |
| Avg LOC/Function | 7.78 |
| Median LOC/Function | 4.00 |
| Imports | 4 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 3.07 | 0 |
| Cognitive (SonarJS) | 20 | 4.67 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 929608 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


