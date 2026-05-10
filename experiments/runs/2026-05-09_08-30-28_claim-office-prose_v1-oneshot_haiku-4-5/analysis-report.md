# Analysis Report: 2026-05-09_08-30-28_claim-office-prose_v1-oneshot_haiku-4-5

Generated: 2026-05-10T14:55:44+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v1-oneshot |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 191s |
| Started | 2026-05-09T08:30:28+00:00 |
| Ended | 2026-05-09T08:33:41+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, pricing.ts, types.ts
- **Implementation LOC** (total): 279
- **Test file**: claims.spec.ts
- **Test file LOC**: 198
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (32 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-30-28_claim-office-prose_v1-oneshot_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-30-28_claim-office-prose_v1-oneshot_haiku-4-5

 ✓ src/pricing.spec.ts  (18 tests) 3ms
 ✓ src/cli.spec.ts  (5 tests) 3ms
 ✓ src/claims.spec.ts  (9 tests) 3ms

 Test Files  3 passed (3)
      Tests  32 passed (32)
   Start at  14:55:44
   Duration  362ms (transform 62ms, setup 0ms, collect 77ms, tests 9ms, environment 0ms, prepare 278ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 69% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 82 | ×1 | 82 |
| Invocations | 65 | ×2 | 130 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 8 | ×5 | 40 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **670** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 209 |
| Functions | 7 |
| Longest Function | 51 lines |
| Avg LOC/Function | 14.43 |
| Median LOC/Function | 7.00 |
| Imports | 5 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 3.89 | 0 |
| Cognitive (SonarJS) | 10 | 6.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3491827 |
| Context Utilization | 30% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 37.54s |
| Avg Red Phase | 22.37s |
| Avg Green Phase | 15.17s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | N/A |
| Predictions Total | N/A |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


