# Analysis Report: 2026-09-13_17-44-44_claim-office-example-mapping_exact-sol-v1.3-stack-profile-pi_gpt-5-6-sol-codex

Generated: 2026-09-13T18:08:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.3-stack-profile-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1423s |
| Started | 2026-09-13T17:44:45+00:00 |
| Ended | 2026-09-13T18:08:32+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 125
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 176
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-13_17-44-44_claim-office-example-mapping_exact-sol-v1.3-stack-profile-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-13_17-44-44_claim-office-example-mapping_exact-sol-v1.3-stack-profile-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (35 tests) 3632ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  18:08:34
   Duration  3.91s (transform 56ms, setup 0ms, collect 55ms, tests 3.63s, environment 0ms, prepare 69ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 80% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 61 | ×2 | 122 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 8 | ×5 | 40 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **642** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 120 |
| Functions | 9 |
| Longest Function | 18 lines |
| Avg LOC/Function | 7.22 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 4 | 1.87 | 0 |
| Cognitive (SonarJS) | 3 | 1.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5045866 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 32 |
| Predictions Total | 32 |
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


