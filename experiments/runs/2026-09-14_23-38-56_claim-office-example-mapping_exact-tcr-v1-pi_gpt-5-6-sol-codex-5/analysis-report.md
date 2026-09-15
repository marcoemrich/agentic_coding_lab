# Analysis Report: 2026-09-14_23-38-56_claim-office-example-mapping_exact-tcr-v1-pi_gpt-5-6-sol-codex-5

Generated: 2026-09-14T23:55:00+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-tcr-v1-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 956s |
| Started | 2026-09-14T23:38:58+00:00 |
| Ended | 2026-09-14T23:55:00+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 139
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 209
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_23-38-56_claim-office-example-mapping_exact-tcr-v1-pi_gpt-5-6-sol-codex-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_23-38-56_claim-office-example-mapping_exact-tcr-v1-pi_gpt-5-6-sol-codex-5

 ✓ src/claim-office.spec.ts  (36 tests) 513ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  23:55:01
   Duration  782ms (transform 62ms, setup 0ms, collect 60ms, tests 513ms, environment 0ms, prepare 75ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 36 | ×2 | 72 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 6 | ×5 | 30 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **533** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 127 |
| Functions | 7 |
| Longest Function | 12 lines |
| Avg LOC/Function | 6.14 |
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
| McCabe (Cyclomatic) | 5 | 1.69 | 0 |
| Cognitive (SonarJS) | 4 | 1.83 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6729001 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 36 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 72 |
| Predictions Total | 72 |
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


