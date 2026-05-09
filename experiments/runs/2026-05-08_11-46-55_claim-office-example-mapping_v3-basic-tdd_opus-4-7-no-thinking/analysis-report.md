# Analysis Report: 2026-05-08_11-46-55_claim-office-example-mapping_v3-basic-tdd_opus-4-7-no-thinking

Generated: 2026-05-09T11:10:45+02:00

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

- **Implementation file**: premium.ts
- **Implementation LOC**: 125
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
 ✓ src/scenario.spec.ts  (6 tests) 4ms
 ✓ src/claim.spec.ts  (18 tests) 5ms

 Test Files  3 passed (3)
      Tests  39 passed (39)
   Start at  11:10:46
   Duration  370ms (transform 84ms, setup 0ms, collect 115ms, tests 12ms, environment 0ms, prepare 289ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 29 | ×1 | 29 |
| Invocations | 37 | ×2 | 74 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 10 | ×5 | 50 |
| Assignments | 23 | ×6 | 138 |
| **Total Mass** | | | **323** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 87 |
| Functions | 5 |
| Longest Function | 10 lines |
| Avg LOC/Function | 4 |
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


