# Analysis Report: 2026-05-26_10-27-59_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_qwen3-coder-480b

Generated: 2026-05-26T10:36:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | qwen3-coder-480b |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 481s |
| Started | 2026-05-26T10:27:59+00:00 |
| Ended | 2026-05-26T10:36:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 14
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 100
- **Active tests**: 2
- **Remaining todos**: 46

## Test Results

**Status**: ✅ All tests passing (2 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_10-27-59_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_qwen3-coder-480b
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_10-27-59_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_qwen3-coder-480b

 ✓ src/claim-office.spec.ts  (48 tests | 46 skipped) 2ms

 Test Files  1 passed (1)
      Tests  2 passed | 46 todo (48)
   Start at  10:36:01
   Duration  168ms (transform 29ms, setup 0ms, collect 25ms, tests 2ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 80% |
| Branches | 83% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 5 | ×2 | 10 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 0 | ×5 | 0 |
| Assignments | 3 | ×6 | 18 |
| **Total Mass** | | | **50** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 10 |
| Functions | 1 |
| Longest Function | 15 lines |
| Avg LOC/Function | 15.00 |
| Median LOC/Function | 15.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 3.00 | 0 |
| Cognitive (SonarJS) | 4 | 4.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2424452 |
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
| Predictions Correct | 1 |
| Predictions Total | 2 |
| Accuracy | 50% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


