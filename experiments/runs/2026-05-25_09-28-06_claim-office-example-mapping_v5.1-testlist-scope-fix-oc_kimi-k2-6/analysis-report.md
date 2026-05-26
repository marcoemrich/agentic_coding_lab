# Analysis Report: 2026-05-25_09-28-06_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6

Generated: 2026-05-26T13:15:53+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | kimi-k2-6 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1925s |
| Started | 2026-05-25T09:28:06+00:00 |
| Ended | 2026-05-25T10:00:12+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, engine.ts
- **Implementation LOC** (total): 286
- **Test file**: engine.spec.ts
- **Test file LOC**: 471
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-25_09-28-06_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-25_09-28-06_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_kimi-k2-6

 ✓ src/cli.spec.ts  (4 tests) 4ms
 ✓ src/engine.spec.ts  (46 tests) 8ms

 Test Files  2 passed (2)
      Tests  50 passed (50)
   Start at  13:15:56
   Duration  422ms (transform 69ms, setup 0ms, collect 91ms, tests 12ms, environment 0ms, prepare 181ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 27 | ×4 | 108 |
| Loops | 11 | ×5 | 55 |
| Assignments | 68 | ×6 | 408 |
| **Total Mass** | | | **800** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 216 |
| Functions | 5 |
| Longest Function | 79 lines |
| Avg LOC/Function | 40.00 |
| Median LOC/Function | 27.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **16** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 22 | 6.25 | 2 |
| Cognitive (SonarJS) | 26 | 12.20 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2590768 |
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


