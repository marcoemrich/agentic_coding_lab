# Analysis Report: 2026-09-15_08-49-04_claim-office-example-mapping_exact-tcr-v1.1-srp-pi_gpt-5-6-sol-codex

Generated: 2026-09-15T09:05:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-tcr-v1.1-srp-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 972s |
| Started | 2026-09-15T08:49:05+00:00 |
| Ended | 2026-09-15T09:05:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 99
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 210
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-15_08-49-04_claim-office-example-mapping_exact-tcr-v1.1-srp-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-15_08-49-04_claim-office-example-mapping_exact-tcr-v1.1-srp-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (38 tests) 3738ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  09:05:21
   Duration  4.06s (transform 92ms, setup 0ms, collect 88ms, tests 3.74s, environment 0ms, prepare 76ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 45 | ×2 | 90 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 7 | ×5 | 35 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **511** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 93 |
| Functions | 5 |
| Longest Function | 21 lines |
| Avg LOC/Function | 9.20 |
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
| McCabe (Cyclomatic) | 5 | 1.94 | 0 |
| Cognitive (SonarJS) | 4 | 2.43 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3729879 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 76 |
| Predictions Total | 76 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 38 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


