# Analysis Report: 2026-09-15_15-34-33_claim-office-example-mapping_exact-tcr-v1.4-domain-boundary-app-pi_gpt-5-6-sol-codex

Generated: 2026-09-15T15:48:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-tcr-v1.4-domain-boundary-app-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 807s |
| Started | 2026-09-15T15:34:35+00:00 |
| Ended | 2026-09-15T15:48:06+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 113
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 184
- **Active tests**: 31
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (31 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-15_15-34-33_claim-office-example-mapping_exact-tcr-v1.4-domain-boundary-app-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-15_15-34-33_claim-office-example-mapping_exact-tcr-v1.4-domain-boundary-app-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (31 tests) 3745ms

 Test Files  1 passed (1)
      Tests  31 passed (31)
   Start at  15:48:07
   Duration  4.05s (transform 64ms, setup 0ms, collect 60ms, tests 3.75s, environment 0ms, prepare 86ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 56 | ×2 | 112 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 5 | ×5 | 25 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **529** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 108 |
| Functions | 12 |
| Longest Function | 9 lines |
| Avg LOC/Function | 5.17 |
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
| McCabe (Cyclomatic) | 4 | 1.73 | 0 |
| Cognitive (SonarJS) | 3 | 2.12 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3129072 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 31 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 61 |
| Predictions Total | 62 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 31 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


