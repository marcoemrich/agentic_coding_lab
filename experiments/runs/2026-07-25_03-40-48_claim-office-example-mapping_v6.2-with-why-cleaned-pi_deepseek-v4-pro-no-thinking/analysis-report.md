# Analysis Report: 2026-07-25_03-40-48_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro-no-thinking

Generated: 2026-07-25T03:53:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | deepseek-v4-pro-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 731s |
| Started | 2026-07-25T03:40:48+00:00 |
| Ended | 2026-07-25T03:53:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 206
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 642
- **Active tests**: 48
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_03-40-48_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_03-40-48_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro-no-thinking

 ✓ src/claim-office.spec.ts  (48 tests) 7ms

 Test Files  1 passed (1)
      Tests  48 passed (48)
   Start at  03:53:02
   Duration  202ms (transform 48ms, setup 0ms, collect 63ms, tests 7ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 78 | ×1 | 78 |
| Invocations | 57 | ×2 | 114 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 10 | ×5 | 50 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **692** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 166 |
| Functions | 2 |
| Longest Function | 124 lines |
| Avg LOC/Function | 76.50 |
| Median LOC/Function | 76.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 11 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **26** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 29 | 7.60 | 1 |
| Cognitive (SonarJS) | 74 | 26.67 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 917138 |
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
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


