# Analysis Report: 2026-05-16_09-34-18_claim-office-prose_v2-iterative_opus-4-7-no-thinking

Generated: 2026-05-23T11:51:08+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v2-iterative |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 219s |
| Started | 2026-05-16T09:34:18+00:00 |
| Ended | 2026-05-16T09:37:58+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, pricing.ts, quote.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 337
- **Test file**: claim.spec.ts
- **Test file LOC**: 108
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (23 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-16_09-34-18_claim-office-prose_v2-iterative_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-16_09-34-18_claim-office-prose_v2-iterative_opus-4-7-no-thinking

 ✓ src/claim.spec.ts  (7 tests) 3ms
 ✓ src/quote.spec.ts  (13 tests) 4ms
 ✓ src/scenario.spec.ts  (3 tests) 5ms

 Test Files  3 passed (3)
      Tests  23 passed (23)
   Start at  11:51:09
   Duration  385ms (transform 64ms, setup 2ms, collect 87ms, tests 12ms, environment 0ms, prepare 269ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 82% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 90 | ×1 | 90 |
| Invocations | 99 | ×2 | 198 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 11 | ×5 | 55 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **811** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 266 |
| Functions | 18 |
| Longest Function | 40 lines |
| Avg LOC/Function | 8.72 |
| Median LOC/Function | 4.50 |
| Imports | 10 |

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
| McCabe (Cyclomatic) | 6 | 2.09 | 0 |
| Cognitive (SonarJS) | 8 | 3.44 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1865169 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 84.36s |
| Avg Red Phase | 27.45s |
| Avg Green Phase | 56.91s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | N/A |
| Predictions Total | N/A |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


