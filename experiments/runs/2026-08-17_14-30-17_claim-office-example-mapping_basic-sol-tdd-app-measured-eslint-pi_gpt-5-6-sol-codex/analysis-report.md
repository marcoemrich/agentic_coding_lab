# Analysis Report: 2026-08-17_14-30-17_claim-office-example-mapping_basic-sol-tdd-app-measured-eslint-pi_gpt-5-6-sol-codex

Generated: 2026-08-17T14:45:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-app-measured-eslint-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 895s |
| Started | 2026-08-17T14:30:17+00:00 |
| Ended | 2026-08-17T14:45:13+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 141
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 197
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_14-30-17_claim-office-example-mapping_basic-sol-tdd-app-measured-eslint-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_14-30-17_claim-office-example-mapping_basic-sol-tdd-app-measured-eslint-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (30 tests) 1137ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  14:45:14
   Duration  1.30s (transform 36ms, setup 0ms, collect 35ms, tests 1.14s, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 50 | ×2 | 100 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 5 | ×5 | 25 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **508** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 126 |
| Functions | 8 |
| Longest Function | 17 lines |
| Avg LOC/Function | 6.88 |
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
| McCabe (Cyclomatic) | 4 | 1.80 | 0 |
| Cognitive (SonarJS) | 4 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5087478 |
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
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 30 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


