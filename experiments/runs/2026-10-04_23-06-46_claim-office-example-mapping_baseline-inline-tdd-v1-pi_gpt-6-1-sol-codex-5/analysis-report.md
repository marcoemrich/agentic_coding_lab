# Analysis Report: 2026-10-04_23-06-46_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex-5

Generated: 2026-10-04T23:14:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-1-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 471s |
| Started | 2026-10-04T23:06:48+00:00 |
| Ended | 2026-10-04T23:14:45+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts, validation.ts
- **Implementation LOC** (total): 164
- **Test files**: claims.spec.ts, cli.spec.ts, office.spec.ts
- **Test LOC** (total): 150
- **Active tests**: 27
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (65 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-04_23-06-46_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-04_23-06-46_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex-5

 ✓ src/claims.spec.ts  (23 tests) 9ms
 ✓ src/cli.spec.ts  (18 tests) 4482ms
 ✓ src/office.spec.ts  (24 tests) 6ms

 Test Files  3 passed (3)
      Tests  65 passed (65)
   Start at  23:14:47
   Duration  5.67s (transform 127ms, setup 0ms, collect 183ms, tests 4.50s, environment 0ms, prepare 324ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 83% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 81 | ×1 | 81 |
| Invocations | 92 | ×2 | 184 |
| Conditionals | 24 | ×4 | 96 |
| Loops | 10 | ×5 | 50 |
| Assignments | 32 | ×6 | 192 |
| **Total Mass** | | | **603** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 147 |
| Functions | 15 |
| Longest Function | 17 lines |
| Avg LOC/Function | 6.07 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 5 | 2.40 | 0 |
| Cognitive (SonarJS) | 4 | 2.31 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 995034 |
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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


