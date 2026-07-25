# Analysis Report: 2026-07-25_03-37-05_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro-no-thinking

Generated: 2026-07-25T13:08:20+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | deepseek-v4-pro-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 552s |
| Started | 2026-07-25T03:37:05+00:00 |
| Ended | 2026-07-25T03:46:18+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 222
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 500
- **Active tests**: 48
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-37-05_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-37-05_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro-no-thinking

 ✓ src/claim-office.spec.ts  (48 tests) 6ms

 Test Files  1 passed (1)
      Tests  48 passed (48)
   Start at  13:08:20
   Duration  360ms (transform 36ms, setup 0ms, collect 35ms, tests 6ms, environment 0ms, prepare 81ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 73 | ×2 | 146 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 11 | ×5 | 55 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **692** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 169 |
| Functions | 5 |
| Longest Function | 89 lines |
| Avg LOC/Function | 35.60 |
| Median LOC/Function | 24.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 9 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 0 |
| **Total** | **22** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 16 | 5.38 | 2 |
| Cognitive (SonarJS) | 40 | 13.80 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10682542 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 54 |
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
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


