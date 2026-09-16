# Analysis Report: 2026-09-15_22-21-14_claim-office-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-cc_opus-5-no-thinking

Generated: 2026-09-15T23:04:29+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.5-tcr-parity-domain-trial-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2592s |
| Started | 2026-09-15T22:21:14+00:00 |
| Ended | 2026-09-15T23:04:29+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 296
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 521
- **Active tests**: 59
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (59 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-15_22-21-14_claim-office-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-15_22-21-14_claim-office-example-mapping_exact-sol-v1.5-tcr-parity-domain-trial-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (59 tests) 3769ms

 Test Files  1 passed (1)
      Tests  59 passed (59)
   Start at  23:04:30
   Duration  4.07s (transform 71ms, setup 0ms, collect 75ms, tests 3.77s, environment 0ms, prepare 80ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 79% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 94 | ×2 | 188 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 5 | ×5 | 25 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **651** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 241 |
| Functions | 24 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.62 |
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
| McCabe (Cyclomatic) | 3 | 1.57 | 0 |
| Cognitive (SonarJS) | 2 | 1.23 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 96163464 |
| Context Utilization | 164% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 93 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 50 |
| Predictions Total | 52 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 59 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


