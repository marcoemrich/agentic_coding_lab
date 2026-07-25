# Analysis Report: 2026-07-25_04-43-28_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-terra

Generated: 2026-07-25T04:45:41+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | gpt-5-6-terra |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 132s |
| Started | 2026-07-25T04:43:28+00:00 |
| Ended | 2026-07-25T04:45:41+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 79
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 37
- **Active tests**: 22
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (22 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_04-43-28_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-terra
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_04-43-28_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-terra

 ✓ src/claim-office.spec.ts  (22 tests) 725ms

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  04:45:41
   Duration  888ms (transform 31ms, setup 0ms, collect 29ms, tests 725ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 48 | ×2 | 96 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 7 | ×5 | 35 |
| Assignments | 41 | ×6 | 246 |
| **Total Mass** | | | **487** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 74 |
| Functions | 6 |
| Longest Function | 16 lines |
| Avg LOC/Function | 7.67 |
| Median LOC/Function | 5.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 14 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 12 | 3.67 | 1 |
| Cognitive (SonarJS) | 16 | 6.40 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 102655 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 6 |
| Predictions Total | 6 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


