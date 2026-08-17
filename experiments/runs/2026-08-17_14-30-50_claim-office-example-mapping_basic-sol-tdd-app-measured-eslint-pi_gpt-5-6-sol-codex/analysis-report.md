# Analysis Report: 2026-08-17_14-30-50_claim-office-example-mapping_basic-sol-tdd-app-measured-eslint-pi_gpt-5-6-sol-codex

Generated: 2026-08-17T14:48:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-app-measured-eslint-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1075s |
| Started | 2026-08-17T14:30:50+00:00 |
| Ended | 2026-08-17T14:48:46+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 168
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 230
- **Active tests**: 23
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (23 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_14-30-50_claim-office-example-mapping_basic-sol-tdd-app-measured-eslint-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_14-30-50_claim-office-example-mapping_basic-sol-tdd-app-measured-eslint-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (23 tests) 271ms

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  14:48:47
   Duration  440ms (transform 34ms, setup 0ms, collect 34ms, tests 271ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 53 | ×2 | 106 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 5 | ×5 | 25 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **520** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 148 |
| Functions | 11 |
| Longest Function | 21 lines |
| Avg LOC/Function | 7.09 |
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
| McCabe (Cyclomatic) | 4 | 1.94 | 0 |
| Cognitive (SonarJS) | 3 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4277541 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 23 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 30 |
| Predictions Total | 30 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


