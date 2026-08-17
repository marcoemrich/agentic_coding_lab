# Analysis Report: 2026-08-10_16-14-18_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-17T09:36:11+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1379s |
| Started | 2026-08-10T16:14:18+00:00 |
| Ended | 2026-08-10T16:37:18+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 284
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 593
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-10_16-14-18_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-10_16-14-18_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 7ms
 ✓ src/cli.spec.ts  (2 tests) 653ms

 Test Files  2 passed (2)
      Tests  44 passed (44)
   Start at  09:36:12
   Duration  1.00s (transform 57ms, setup 0ms, collect 67ms, tests 660ms, environment 0ms, prepare 175ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 89 | ×2 | 178 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 11 | ×5 | 55 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **644** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 228 |
| Functions | 22 |
| Longest Function | 24 lines |
| Avg LOC/Function | 6.50 |
| Median LOC/Function | 6.50 |
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
| McCabe (Cyclomatic) | 4 | 1.65 | 0 |
| Cognitive (SonarJS) | 3 | 2.18 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 75417876 |
| Context Utilization | 161% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 65.40s |
| Avg Red Phase | 20.93s |
| Avg Green Phase | 19.29s |
| Avg Refactor Phase | 25.18s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 76 |
| Predictions Total | 76 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


