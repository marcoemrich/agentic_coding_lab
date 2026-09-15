# Analysis Report: 2026-09-15_08-38-47_claim-office-example-mapping_exact-tcr-v1.1-srp-pi_gpt-5-6-sol-codex

Generated: 2026-09-15T08:55:18+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-tcr-v1.1-srp-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 987s |
| Started | 2026-09-15T08:38:48+00:00 |
| Ended | 2026-09-15T08:55:18+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 126
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 236
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-15_08-38-47_claim-office-example-mapping_exact-tcr-v1.1-srp-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-15_08-38-47_claim-office-example-mapping_exact-tcr-v1.1-srp-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (34 tests) 3578ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  08:55:19
   Duration  3.87s (transform 74ms, setup 0ms, collect 70ms, tests 3.58s, environment 0ms, prepare 74ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 57 | ×2 | 114 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 7 | ×5 | 35 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **538** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 112 |
| Functions | 8 |
| Longest Function | 14 lines |
| Avg LOC/Function | 7.50 |
| Median LOC/Function | 8.00 |
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
| McCabe (Cyclomatic) | 4 | 1.52 | 0 |
| Cognitive (SonarJS) | 2 | 1.43 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5490318 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 68 |
| Predictions Total | 68 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 35 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


