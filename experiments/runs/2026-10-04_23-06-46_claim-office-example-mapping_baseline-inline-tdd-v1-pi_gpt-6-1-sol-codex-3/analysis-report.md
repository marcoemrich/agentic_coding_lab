# Analysis Report: 2026-10-04_23-06-46_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex-3

Generated: 2026-10-04T23:14:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-1-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 473s |
| Started | 2026-10-04T23:06:48+00:00 |
| Ended | 2026-10-04T23:14:47+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts, validation.ts
- **Implementation LOC** (total): 167
- **Test files**: claims.spec.ts, cli.spec.ts, office.spec.ts
- **Test LOC** (total): 186
- **Active tests**: 21
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (72 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-04_23-06-46_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-04_23-06-46_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex-3

 ✓ src/claims.spec.ts  (25 tests) 7ms
 ✓ src/office.spec.ts  (25 tests) 6ms
 ✓ src/cli.spec.ts  (22 tests) 5381ms

 Test Files  3 passed (3)
      Tests  72 passed (72)
   Start at  23:14:48
   Duration  6.47s (transform 135ms, setup 0ms, collect 171ms, tests 5.39s, environment 0ms, prepare 309ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 81 | ×1 | 81 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 11 | ×5 | 55 |
| Assignments | 40 | ×6 | 240 |
| **Total Mass** | | | **634** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 154 |
| Functions | 12 |
| Longest Function | 18 lines |
| Avg LOC/Function | 8.67 |
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
| McCabe (Cyclomatic) | 5 | 2.30 | 0 |
| Cognitive (SonarJS) | 4 | 2.64 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 903152 |
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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


