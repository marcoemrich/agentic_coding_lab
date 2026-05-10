# Analysis Report: 2026-05-08_11-36-07_claim-office-example-mapping_v3-basic-tdd_opus-4-7-no-thinking

Generated: 2026-05-10T14:53:59+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 356s |
| Started | 2026-05-08T11:36:07+00:00 |
| Ended | 2026-05-08T11:42:04+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 400
- **Test file**: premium.spec.ts
- **Test file LOC**: 221
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-36-07_claim-office-example-mapping_v3-basic-tdd_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-36-07_claim-office-example-mapping_v3-basic-tdd_opus-4-7-no-thinking

 ✓ src/scenario.spec.ts  (5 tests) 3ms
 ✓ src/premium.spec.ts  (18 tests) 4ms
 ✓ src/claim.spec.ts  (17 tests) 5ms

 Test Files  3 passed (3)
      Tests  40 passed (40)
   Start at  14:54:00
   Duration  381ms (transform 77ms, setup 0ms, collect 109ms, tests 12ms, environment 0ms, prepare 326ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 96 | ×1 | 96 |
| Invocations | 123 | ×2 | 246 |
| Conditionals | 30 | ×4 | 120 |
| Loops | 15 | ×5 | 75 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **933** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 330 |
| Functions | 14 |
| Longest Function | 34 lines |
| Avg LOC/Function | 16.57 |
| Median LOC/Function | 17.00 |
| Imports | 6 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 3.69 | 0 |
| Cognitive (SonarJS) | 12 | 5.73 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4185323 |
| Context Utilization | 8% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 52.58s |
| Avg Red Phase | 16.73s |
| Avg Green Phase | 7.93s |
| Avg Refactor Phase | 27.92s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


