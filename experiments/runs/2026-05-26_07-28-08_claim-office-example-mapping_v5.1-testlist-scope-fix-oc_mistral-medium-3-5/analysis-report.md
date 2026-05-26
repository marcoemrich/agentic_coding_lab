# Analysis Report: 2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5

Generated: 2026-05-26T13:21:10+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | mistral-medium-3-5 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4498s |
| Started | 2026-05-26T07:28:08+00:00 |
| Ended | 2026-05-26T08:43:09+00:00 |

## Code Metrics

- **Implementation files**: cli.ts
- **Implementation LOC** (total): 182
- **Test file**: cli.spec.ts
- **Test file LOC**: 293
- **Active tests**: 23
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (23 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_07-28-08_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5

Error: Unknown item type "broomstick"
Error: More damage entries for amulet than policy covers
Error: Negative damage amount -200
Error: More damage entries for sword than policy covers
 ✓ src/cli.spec.ts  (23 tests) 4045ms

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  13:21:10
   Duration  4.43s (transform 33ms, setup 0ms, collect 30ms, tests 4.04s, environment 0ms, prepare 93ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 55 | ×2 | 110 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 12 | ×5 | 60 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **612** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 141 |
| Functions | 0 |
| Longest Function | 0 lines |
| Avg LOC/Function | 0.00 |
| Median LOC/Function | 0.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 31 | 6.14 | 1 |
| Cognitive (SonarJS) | 65 | 11.83 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16862920 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


