# Analysis Report: 2026-07-25_04-34-55_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-sol

Generated: 2026-07-25T04:42:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 454s |
| Started | 2026-07-25T04:34:55+00:00 |
| Ended | 2026-07-25T04:42:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 93
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 148
- **Active tests**: 22
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (22 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_04-34-55_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_04-34-55_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (22 tests) 727ms

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  04:42:30
   Duration  895ms (transform 34ms, setup 0ms, collect 35ms, tests 727ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 34 | ×2 | 68 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 7 | ×5 | 35 |
| Assignments | 25 | ×6 | 150 |
| **Total Mass** | | | **359** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 86 |
| Functions | 2 |
| Longest Function | 33 lines |
| Avg LOC/Function | 17.50 |
| Median LOC/Function | 17.50 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **18** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 2.67 | 0 |
| Cognitive (SonarJS) | 16 | 7.33 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 341834 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 32 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 24 |
| Predictions Total | 24 |
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


