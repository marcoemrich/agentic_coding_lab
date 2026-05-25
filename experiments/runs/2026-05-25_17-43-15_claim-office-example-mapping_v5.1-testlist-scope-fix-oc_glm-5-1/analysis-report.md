# Analysis Report: 2026-05-25_17-43-15_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1

Generated: 2026-05-25T18:12:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | glm-5-1 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1749s |
| Started | 2026-05-25T17:43:15+00:00 |
| Ended | 2026-05-25T18:12:25+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 277
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 328
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_17-43-15_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_17-43-15_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_glm-5-1

 ✓ src/claim-office.spec.ts  (35 tests) 6ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  18:12:25
   Duration  175ms (transform 42ms, setup 0ms, collect 43ms, tests 6ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 83% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 78 | ×1 | 78 |
| Invocations | 100 | ×2 | 200 |
| Conditionals | 25 | ×4 | 100 |
| Loops | 11 | ×5 | 55 |
| Assignments | 74 | ×6 | 444 |
| **Total Mass** | | | **877** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 235 |
| Functions | 17 |
| Longest Function | 23 lines |
| Avg LOC/Function | 11.06 |
| Median LOC/Function | 11.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 3.30 | 0 |
| Cognitive (SonarJS) | 8 | 4.23 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11026989 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 6 |
| Predictions Total | 6 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


