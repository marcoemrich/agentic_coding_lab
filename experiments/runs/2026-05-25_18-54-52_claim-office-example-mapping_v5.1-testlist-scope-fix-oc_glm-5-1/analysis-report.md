# Analysis Report: 2026-05-25_18-54-52_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1

Generated: 2026-05-25T19:25:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | glm-5-1 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1809s |
| Started | 2026-05-25T18:54:52+00:00 |
| Ended | 2026-05-25T19:25:02+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 211
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 419
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_18-54-52_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_18-54-52_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1

 ✓ src/claim-office.spec.ts  (44 tests) 7ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  19:25:03
   Duration  188ms (transform 42ms, setup 0ms, collect 43ms, tests 7ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 22 | ×4 | 88 |
| Loops | 10 | ×5 | 50 |
| Assignments | 80 | ×6 | 480 |
| **Total Mass** | | | **841** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 191 |
| Functions | 9 |
| Longest Function | 30 lines |
| Avg LOC/Function | 15.11 |
| Median LOC/Function | 13.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 4.17 | 1 |
| Cognitive (SonarJS) | 15 | 7.25 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9830098 |
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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


