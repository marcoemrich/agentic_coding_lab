# Analysis Report: 2026-07-25_04-21-25_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-sol

Generated: 2026-07-25T04:28:09+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 402s |
| Started | 2026-07-25T04:21:25+00:00 |
| Ended | 2026-07-25T04:28:09+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 96
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 105
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_04-21-25_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_04-21-25_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (11 tests) 836ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  04:28:10
   Duration  1.02s (transform 47ms, setup 0ms, collect 45ms, tests 836ms, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 38 | ×2 | 76 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 6 | ×5 | 30 |
| Assignments | 42 | ×6 | 252 |
| **Total Mass** | | | **460** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 88 |
| Functions | 7 |
| Longest Function | 17 lines |
| Avg LOC/Function | 6.00 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **16** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.81 | 0 |
| Cognitive (SonarJS) | 4 | 2.60 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 266511 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 20 |
| Predictions Total | 20 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


