# Analysis Report: 2026-09-14_02-26-31_claim-office-example-mapping_exact-sol-v1.3.1-ponytail-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T02:43:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.3.1-ponytail-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1038s |
| Started | 2026-09-14T02:26:33+00:00 |
| Ended | 2026-09-14T02:43:59+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 109
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 212
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_02-26-31_claim-office-example-mapping_exact-sol-v1.3.1-ponytail-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_02-26-31_claim-office-example-mapping_exact-sol-v1.3.1-ponytail-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (37 tests) 1322ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  02:44:01
   Duration  1.73s (transform 97ms, setup 0ms, collect 94ms, tests 1.32s, environment 0ms, prepare 92ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 43 | ×2 | 86 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 6 | ×5 | 30 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **511** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 100 |
| Functions | 5 |
| Longest Function | 13 lines |
| Avg LOC/Function | 7.80 |
| Median LOC/Function | 8.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 5 | 1.94 | 0 |
| Cognitive (SonarJS) | 4 | 2.14 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5479664 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 32 |
| Predictions Total | 34 |
| Accuracy | 94% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 37 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


