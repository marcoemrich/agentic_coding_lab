# Analysis Report: 2026-07-25_03-24-15_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro

Generated: 2026-07-25T13:07:20+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | deepseek-v4-pro |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 753s |
| Started | 2026-07-25T03:24:15+00:00 |
| Ended | 2026-07-25T03:36:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 303
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 274
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-24-15_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-24-15_claim-office-example-mapping_v6.2-with-why-cleaned-pi_deepseek-v4-pro

 ✓ src/claim-office.spec.ts  (43 tests) 7ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  13:07:21
   Duration  405ms (transform 38ms, setup 0ms, collect 36ms, tests 7ms, environment 0ms, prepare 110ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 62% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 92 | ×1 | 92 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 20 | ×5 | 100 |
| Assignments | 64 | ×6 | 384 |
| **Total Mass** | | | **820** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 233 |
| Functions | 4 |
| Longest Function | 64 lines |
| Avg LOC/Function | 17.50 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 6 |
| Duplication | 0 |
| Magic Numbers | 5 |
| Code Quality | 0 |
| **Total** | **11** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 16 | 7.00 | 2 |
| Cognitive (SonarJS) | 21 | 12.75 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12431661 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 36 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 32 |
| Predictions Total | 32 |
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


