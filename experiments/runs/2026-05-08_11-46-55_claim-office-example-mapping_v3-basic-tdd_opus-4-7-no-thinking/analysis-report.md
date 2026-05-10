# Analysis Report: 2026-05-08_11-46-55_claim-office-example-mapping_v3-basic-tdd_opus-4-7-no-thinking

Generated: 2026-05-10T14:54:20+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 291s |
| Started | 2026-05-08T11:46:55+00:00 |
| Ended | 2026-05-08T11:51:47+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 422
- **Test file**: premium.spec.ts
- **Test file LOC**: 115
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-46-55_claim-office-example-mapping_v3-basic-tdd_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-46-55_claim-office-example-mapping_v3-basic-tdd_opus-4-7-no-thinking

 ✓ src/premium.spec.ts  (15 tests) 3ms
 ✓ src/scenario.spec.ts  (6 tests) 3ms
 ✓ src/claim.spec.ts  (18 tests) 4ms

 Test Files  3 passed (3)
      Tests  39 passed (39)
   Start at  14:54:21
   Duration  359ms (transform 66ms, setup 0ms, collect 86ms, tests 10ms, environment 0ms, prepare 240ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 87 | ×1 | 87 |
| Invocations | 123 | ×2 | 246 |
| Conditionals | 32 | ×4 | 128 |
| Loops | 21 | ×5 | 105 |
| Assignments | 82 | ×6 | 492 |
| **Total Mass** | | | **1058** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 321 |
| Functions | 17 |
| Longest Function | 72 lines |
| Avg LOC/Function | 11.24 |
| Median LOC/Function | 4.00 |
| Imports | 6 |

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
| McCabe (Cyclomatic) | 16 | 3.20 | 1 |
| Cognitive (SonarJS) | 18 | 6.00 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3080196 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 42.70s |
| Avg Red Phase | 5.91s |
| Avg Green Phase | 9.12s |
| Avg Refactor Phase | 27.67s |

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
| Tests Passed Immediately | 0 |


