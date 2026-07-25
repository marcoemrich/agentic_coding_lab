# Analysis Report: 2026-07-25_03-18-36_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro-no-thinking

Generated: 2026-07-25T13:06:48+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | deepseek-v4-pro-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 913s |
| Started | 2026-07-25T03:18:36+00:00 |
| Ended | 2026-07-25T03:33:50+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 212
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 566
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-18-36_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-18-36_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 7ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  13:06:49
   Duration  377ms (transform 41ms, setup 0ms, collect 38ms, tests 7ms, environment 0ms, prepare 76ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 72 | ×1 | 72 |
| Invocations | 54 | ×2 | 108 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 8 | ×5 | 40 |
| Assignments | 65 | ×6 | 390 |
| **Total Mass** | | | **694** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 180 |
| Functions | 2 |
| Longest Function | 85 lines |
| Avg LOC/Function | 59.50 |
| Median LOC/Function | 59.50 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 8 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **9** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 24 | 12.00 | 2 |
| Cognitive (SonarJS) | 56 | 36.50 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14243569 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 70 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 28 |
| Predictions Total | 28 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


