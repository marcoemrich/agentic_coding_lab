# Analysis Report: 2026-05-26_06-48-59_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5

Generated: 2026-05-26T13:20:48+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | mistral-medium-3-5 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2053s |
| Started | 2026-05-26T06:48:59+00:00 |
| Ended | 2026-05-26T07:23:13+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 278
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 509
- **Active tests**: 26
- **Remaining todos**: 27

## Test Results

**Status**: ✅ All tests passing (26 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_06-48-59_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_06-48-59_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5

 ✓ src/claim-office.spec.ts  (53 tests | 27 skipped) 4ms

 Test Files  1 passed (1)
      Tests  26 passed | 27 todo (53)
   Start at  13:20:49
   Duration  374ms (transform 43ms, setup 0ms, collect 35ms, tests 4ms, environment 0ms, prepare 116ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 63% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 87 | ×1 | 87 |
| Invocations | 49 | ×2 | 98 |
| Conditionals | 26 | ×4 | 104 |
| Loops | 15 | ×5 | 75 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **736** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 197 |
| Functions | 1 |
| Longest Function | 177 lines |
| Avg LOC/Function | 177.00 |
| Median LOC/Function | 177.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 6 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **22** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 27 | 5.38 | 1 |
| Cognitive (SonarJS) | 54 | 10.33 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10685238 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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


