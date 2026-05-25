# Analysis Report: 2026-05-25_15-54-17_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6

Generated: 2026-05-25T16:33:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | kimi-k2-6 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2325s |
| Started | 2026-05-25T15:54:17+00:00 |
| Ended | 2026-05-25T16:33:03+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 225
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 702
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_15-54-17_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_15-54-17_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6

 ✓ src/claim-office.spec.ts  (40 tests) 6ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  16:33:03
   Duration  177ms (transform 44ms, setup 0ms, collect 43ms, tests 6ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 82 | ×1 | 82 |
| Invocations | 88 | ×2 | 176 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 13 | ×5 | 65 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **685** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 189 |
| Functions | 11 |
| Longest Function | 25 lines |
| Avg LOC/Function | 10.55 |
| Median LOC/Function | 9.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 25 |
| Code Quality | 0 |
| **Total** | **27** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 17 | 3.41 | 1 |
| Cognitive (SonarJS) | 21 | 5.22 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12520963 |
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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


