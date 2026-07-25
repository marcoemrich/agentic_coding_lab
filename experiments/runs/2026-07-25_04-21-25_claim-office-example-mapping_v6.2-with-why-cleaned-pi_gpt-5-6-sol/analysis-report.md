# Analysis Report: 2026-07-25_04-21-25_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-sol

Generated: 2026-07-25T13:10:07+02:00

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

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_04-21-25_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_04-21-25_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (11 tests) 791ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  13:10:08
   Duration  1.20s (transform 37ms, setup 0ms, collect 38ms, tests 791ms, environment 0ms, prepare 73ms)
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
| Total Tokens | 1812764 |
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


