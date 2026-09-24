# Analysis Report: 2026-09-23_12-59-59_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex

Generated: 2026-09-23T13:32:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1906s |
| Started | 2026-09-23T13:00:04+00:00 |
| Ended | 2026-09-23T13:32:05+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts
- **Implementation LOC** (total): 93
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 66
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_12-59-59_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_12-59-59_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex

 ✓ src/claim-office.spec.ts  (46 tests) 10517ms

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  13:32:07
   Duration  10.86s (transform 56ms, setup 0ms, collect 52ms, tests 10.52s, environment 0ms, prepare 105ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 45 | ×2 | 90 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 7 | ×5 | 35 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **506** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 82 |
| Functions | 9 |
| Longest Function | 13 lines |
| Avg LOC/Function | 4.56 |
| Median LOC/Function | 4.00 |
| Imports | 4 |

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
| McCabe (Cyclomatic) | 5 | 2.38 | 0 |
| Cognitive (SonarJS) | 4 | 2.11 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6331495 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 46 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 92 |
| Predictions Total | 92 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 46 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


