# Analysis Report: 2026-09-16_10-38-54_claim-office-example-mapping_exact-sol-v1.6.1-naming-refactor-trial-cc_opus-5-no-thinking

Generated: 2026-09-16T11:02:00+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6.1-naming-refactor-trial-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1384s |
| Started | 2026-09-16T10:38:54+00:00 |
| Ended | 2026-09-16T11:02:00+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 314
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 907
- **Active tests**: 57
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (57 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_10-38-54_claim-office-example-mapping_exact-sol-v1.6.1-naming-refactor-trial-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_10-38-54_claim-office-example-mapping_exact-sol-v1.6.1-naming-refactor-trial-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (57 tests) 2088ms

 Test Files  1 passed (1)
      Tests  57 passed (57)
   Start at  11:02:01
   Duration  2.40s (transform 92ms, setup 0ms, collect 87ms, tests 2.09s, environment 0ms, prepare 82ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 84 | ×2 | 168 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 11 | ×5 | 55 |
| Assignments | 58 | ×6 | 348 |
| **Total Mass** | | | **695** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 258 |
| Functions | 16 |
| Longest Function | 27 lines |
| Avg LOC/Function | 6.81 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 4 | 2.05 | 0 |
| Cognitive (SonarJS) | 3 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 32429502 |
| Context Utilization | 98% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 20 |
| Avg Cycle Time | 36.69s |
| Avg Red Phase | 25.73s |
| Avg Green Phase | 10.96s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 108 |
| Predictions Total | 108 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 53 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


