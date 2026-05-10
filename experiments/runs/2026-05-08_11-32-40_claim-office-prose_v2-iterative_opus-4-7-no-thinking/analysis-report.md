# Analysis Report: 2026-05-08_11-32-40_claim-office-prose_v2-iterative_opus-4-7-no-thinking

Generated: 2026-05-10T14:53:48+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v2-iterative |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 190s |
| Started | 2026-05-08T11:32:40+00:00 |
| Ended | 2026-05-08T11:35:51+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, pricing.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 338
- **Test file**: pricing.spec.ts
- **Test file LOC**: 134
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (24 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-32-40_claim-office-prose_v2-iterative_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-32-40_claim-office-prose_v2-iterative_opus-4-7-no-thinking

 ✓ src/scenario.spec.ts  (3 tests) 3ms
 ✓ src/pricing.spec.ts  (14 tests) 5ms
 ✓ src/claim.spec.ts  (7 tests) 3ms

 Test Files  3 passed (3)
      Tests  24 passed (24)
   Start at  14:53:49
   Duration  392ms (transform 58ms, setup 1ms, collect 77ms, tests 11ms, environment 0ms, prepare 337ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 89 | ×1 | 89 |
| Invocations | 91 | ×2 | 182 |
| Conditionals | 22 | ×4 | 88 |
| Loops | 13 | ×5 | 65 |
| Assignments | 64 | ×6 | 384 |
| **Total Mass** | | | **808** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 271 |
| Functions | 16 |
| Longest Function | 37 lines |
| Avg LOC/Function | 10.81 |
| Median LOC/Function | 5.50 |
| Imports | 8 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.09 | 0 |
| Cognitive (SonarJS) | 7 | 3.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1713464 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 78.05s |
| Avg Red Phase | 29.32s |
| Avg Green Phase | 48.73s |
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


