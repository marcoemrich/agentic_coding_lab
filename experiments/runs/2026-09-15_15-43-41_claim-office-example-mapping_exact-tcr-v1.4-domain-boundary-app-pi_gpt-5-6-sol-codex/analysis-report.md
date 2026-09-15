# Analysis Report: 2026-09-15_15-43-41_claim-office-example-mapping_exact-tcr-v1.4-domain-boundary-app-pi_gpt-5-6-sol-codex

Generated: 2026-09-15T16:02:29+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-tcr-v1.4-domain-boundary-app-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1124s |
| Started | 2026-09-15T15:43:42+00:00 |
| Ended | 2026-09-15T16:02:29+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 160
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 299
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-15_15-43-41_claim-office-example-mapping_exact-tcr-v1.4-domain-boundary-app-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-15_15-43-41_claim-office-example-mapping_exact-tcr-v1.4-domain-boundary-app-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (30 tests) 3482ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  16:02:30
   Duration  3.82s (transform 108ms, setup 0ms, collect 105ms, tests 3.48s, environment 0ms, prepare 69ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 70 | ×2 | 140 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 7 | ×5 | 35 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **604** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 142 |
| Functions | 16 |
| Longest Function | 15 lines |
| Avg LOC/Function | 5.56 |
| Median LOC/Function | 3.50 |
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
| McCabe (Cyclomatic) | 4 | 1.64 | 0 |
| Cognitive (SonarJS) | 3 | 1.64 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5273337 |
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
| Predictions Correct | 59 |
| Predictions Total | 60 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 30 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


