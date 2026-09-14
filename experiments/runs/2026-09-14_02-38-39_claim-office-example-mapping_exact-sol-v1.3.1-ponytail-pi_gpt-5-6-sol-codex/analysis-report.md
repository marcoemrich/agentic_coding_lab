# Analysis Report: 2026-09-14_02-38-39_claim-office-example-mapping_exact-sol-v1.3.1-ponytail-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T02:57:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.3.1-ponytail-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1103s |
| Started | 2026-09-14T02:38:40+00:00 |
| Ended | 2026-09-14T02:57:06+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 97
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 197
- **Active tests**: 25
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (25 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_02-38-39_claim-office-example-mapping_exact-sol-v1.3.1-ponytail-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_02-38-39_claim-office-example-mapping_exact-sol-v1.3.1-ponytail-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (25 tests) 3116ms

 Test Files  1 passed (1)
      Tests  25 passed (25)
   Start at  02:57:07
   Duration  3.51s (transform 107ms, setup 0ms, collect 102ms, tests 3.12s, environment 0ms, prepare 99ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 84% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 50 | ×2 | 100 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 8 | ×5 | 40 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **561** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 89 |
| Functions | 6 |
| Longest Function | 19 lines |
| Avg LOC/Function | 8.00 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 8 | 2.11 | 0 |
| Cognitive (SonarJS) | 8 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4349435 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 25 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 25 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


