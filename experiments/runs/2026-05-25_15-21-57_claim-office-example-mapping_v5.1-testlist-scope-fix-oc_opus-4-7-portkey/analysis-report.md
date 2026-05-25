# Analysis Report: 2026-05-25_15-21-57_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_opus-4-7-portkey

Generated: 2026-05-25T15:30:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | opus-4-7-portkey |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 503s |
| Started | 2026-05-25T15:21:57+00:00 |
| Ended | 2026-05-25T15:30:21+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, scenario.ts
- **Implementation LOC** (total): 242
- **Test file**: cli.spec.ts
- **Test file LOC**: 57
- **Active tests**: 4
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_15-21-57_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_opus-4-7-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_15-21-57_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_opus-4-7-portkey

 ✓ src/scenario.spec.ts  (37 tests) 6ms
 ✓ src/cli.spec.ts  (4 tests) 1382ms

 Test Files  2 passed (2)
      Tests  41 passed (41)
   Start at  15:30:21
   Duration  1.69s (transform 47ms, setup 0ms, collect 52ms, tests 1.39s, environment 0ms, prepare 84ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 92 | ×2 | 184 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 12 | ×5 | 60 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **787** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 210 |
| Functions | 17 |
| Longest Function | 25 lines |
| Avg LOC/Function | 8.24 |
| Median LOC/Function | 7.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 8 | 2.67 | 0 |
| Cognitive (SonarJS) | 10 | 3.31 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4350494 |
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


