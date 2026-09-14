# Analysis Report: 2026-09-14_02-35-29_claim-office-example-mapping_exact-sol-v1.3.1-ponytail-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T02:51:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.3.1-ponytail-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 941s |
| Started | 2026-09-14T02:35:30+00:00 |
| Ended | 2026-09-14T02:51:14+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 126
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 156
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_02-35-29_claim-office-example-mapping_exact-sol-v1.3.1-ponytail-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_02-35-29_claim-office-example-mapping_exact-sol-v1.3.1-ponytail-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (30 tests) 1338ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  02:51:16
   Duration  1.66s (transform 76ms, setup 0ms, collect 77ms, tests 1.34s, environment 0ms, prepare 76ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 35 | ×2 | 70 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 9 | ×5 | 45 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **575** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 116 |
| Functions | 4 |
| Longest Function | 17 lines |
| Avg LOC/Function | 12.00 |
| Median LOC/Function | 14.50 |
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
| McCabe (Cyclomatic) | 7 | 2.33 | 0 |
| Cognitive (SonarJS) | 8 | 2.83 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4926305 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 30 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 22 |
| Predictions Total | 22 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 30 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


