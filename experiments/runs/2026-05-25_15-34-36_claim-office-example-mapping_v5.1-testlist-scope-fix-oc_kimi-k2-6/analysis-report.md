# Analysis Report: 2026-05-25_15-34-36_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6

Generated: 2026-05-26T13:17:50+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | kimi-k2-6 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1163s |
| Started | 2026-05-25T15:34:36+00:00 |
| Ended | 2026-05-25T15:54:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 240
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 374
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-25_15-34-36_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-25_15-34-36_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6

 ✓ src/claim-office.spec.ts  (43 tests) 6ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  13:17:52
   Duration  367ms (transform 39ms, setup 0ms, collect 35ms, tests 6ms, environment 0ms, prepare 72ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 86 | ×1 | 86 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 17 | ×5 | 85 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **765** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 174 |
| Functions | 8 |
| Longest Function | 66 lines |
| Avg LOC/Function | 25.12 |
| Median LOC/Function | 19.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 1 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 16 | 4.40 | 2 |
| Cognitive (SonarJS) | 21 | 4.46 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4424731 |
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
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


