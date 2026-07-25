# Analysis Report: 2026-07-25_03-22-09_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro-no-thinking

Generated: 2026-07-25T20:32:57+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | deepseek-v4-pro-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 554s |
| Started | 2026-07-25T03:22:09+00:00 |
| Ended | 2026-07-25T03:31:24+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 250
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 469
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-22-09_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-22-09_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 17ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  20:33:00
   Duration  1.31s (transform 217ms, setup 0ms, collect 137ms, tests 17ms, environment 0ms, prepare 331ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 83% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 111 | ×1 | 111 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 32 | ×4 | 128 |
| Loops | 15 | ×5 | 75 |
| Assignments | 70 | ×6 | 420 |
| **Total Mass** | | | **900** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 188 |
| Functions | 5 |
| Longest Function | 64 lines |
| Avg LOC/Function | 33.80 |
| Median LOC/Function | 35.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 11 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **21** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 16 | 10.40 | 2 |
| Cognitive (SonarJS) | 32 | 15.80 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6235701 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 17 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 28 |
| Predictions Total | 29 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


