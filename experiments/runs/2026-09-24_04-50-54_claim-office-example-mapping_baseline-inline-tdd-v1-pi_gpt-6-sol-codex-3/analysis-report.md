# Analysis Report: 2026-09-24_04-50-54_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex-3

Generated: 2026-09-24T04:54:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 222s |
| Started | 2026-09-24T04:50:56+00:00 |
| Ended | 2026-09-24T04:54:45+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 71
- **Test files**: claims.spec.ts, cli.spec.ts, office.spec.ts
- **Test LOC** (total): 131
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-24_04-50-54_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-24_04-50-54_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex-3

 ✓ src/claims.spec.ts  (5 tests) 6ms
 ✓ src/office.spec.ts  (4 tests) 11ms
 ✓ src/cli.spec.ts  (3 tests) 683ms

 Test Files  3 passed (3)
      Tests  12 passed (12)
   Start at  04:54:46
   Duration  1.65s (transform 97ms, setup 0ms, collect 137ms, tests 700ms, environment 0ms, prepare 295ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 84% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 47 | ×2 | 94 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 27 | ×6 | 162 |
| **Total Mass** | | | **404** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 67 |
| Functions | 3 |
| Longest Function | 31 lines |
| Avg LOC/Function | 12.33 |
| Median LOC/Function | 4.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **20** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 3.86 | 1 |
| Cognitive (SonarJS) | 34 | 8.20 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 496683 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
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


