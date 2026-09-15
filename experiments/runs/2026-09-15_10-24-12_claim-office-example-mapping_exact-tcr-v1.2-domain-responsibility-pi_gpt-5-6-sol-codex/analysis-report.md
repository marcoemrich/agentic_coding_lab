# Analysis Report: 2026-09-15_10-24-12_claim-office-example-mapping_exact-tcr-v1.2-domain-responsibility-pi_gpt-5-6-sol-codex

Generated: 2026-09-15T10:42:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-tcr-v1.2-domain-responsibility-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1110s |
| Started | 2026-09-15T10:24:13+00:00 |
| Ended | 2026-09-15T10:42:46+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 141
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 237
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-15_10-24-12_claim-office-example-mapping_exact-tcr-v1.2-domain-responsibility-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-15_10-24-12_claim-office-example-mapping_exact-tcr-v1.2-domain-responsibility-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (36 tests) 3925ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  10:42:47
   Duration  4.27s (transform 83ms, setup 0ms, collect 84ms, tests 3.92s, environment 1ms, prepare 93ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 56 | ×2 | 112 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 5 | ×5 | 25 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **559** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 128 |
| Functions | 9 |
| Longest Function | 20 lines |
| Avg LOC/Function | 6.89 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 5 | 2.29 | 0 |
| Cognitive (SonarJS) | 4 | 2.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6955020 |
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


