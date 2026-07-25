# Analysis Report: 2026-07-25_03-28-59_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro

Generated: 2026-07-25T13:07:30+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | deepseek-v4-pro |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 692s |
| Started | 2026-07-25T03:28:59+00:00 |
| Ended | 2026-07-25T03:40:32+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 220
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 478
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-28-59_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-28-59_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro

 ✓ src/claim-office.spec.ts  (44 tests) 9ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  13:07:31
   Duration  334ms (transform 39ms, setup 0ms, collect 34ms, tests 9ms, environment 0ms, prepare 92ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 77 | ×1 | 77 |
| Invocations | 59 | ×2 | 118 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 14 | ×5 | 70 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **655** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 167 |
| Functions | 5 |
| Longest Function | 63 lines |
| Avg LOC/Function | 15.00 |
| Median LOC/Function | 3.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 7 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 1 |
| **Total** | **21** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 4.33 | 2 |
| Cognitive (SonarJS) | 31 | 13.75 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15652593 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 24 |
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
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


