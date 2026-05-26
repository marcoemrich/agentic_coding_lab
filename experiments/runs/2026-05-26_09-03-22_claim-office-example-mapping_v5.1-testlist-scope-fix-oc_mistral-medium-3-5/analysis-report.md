# Analysis Report: 2026-05-26_09-03-22_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5

Generated: 2026-05-26T13:21:29+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | mistral-medium-3-5 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4030s |
| Started | 2026-05-26T09:03:22+00:00 |
| Ended | 2026-05-26T10:10:34+00:00 |

## Code Metrics

- **Implementation files**: cli.ts
- **Implementation LOC** (total): 209
- **Test file**: cli.spec.ts
- **Test file LOC**: 797
- **Active tests**: 66
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (66 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_09-03-22_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-26_09-03-22_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_mistral-medium-3-5

 ✓ src/cli.spec.ts  (66 tests) 9ms

 Test Files  1 passed (1)
      Tests  66 passed (66)
   Start at  13:21:29
   Duration  430ms (transform 44ms, setup 0ms, collect 48ms, tests 9ms, environment 0ms, prepare 83ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 79 | ×1 | 79 |
| Invocations | 66 | ×2 | 132 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 20 | ×5 | 100 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **749** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 144 |
| Functions | 2 |
| Longest Function | 181 lines |
| Avg LOC/Function | 99.00 |
| Median LOC/Function | 99.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 12 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **27** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 44 | 12.00 | 1 |
| Cognitive (SonarJS) | 107 | 54.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 20505846 |
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


