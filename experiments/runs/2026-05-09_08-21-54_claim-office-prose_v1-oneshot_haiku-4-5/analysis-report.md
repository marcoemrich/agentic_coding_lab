# Analysis Report: 2026-05-09_08-21-54_claim-office-prose_v1-oneshot_haiku-4-5

Generated: 2026-05-10T14:55:33+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v1-oneshot |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 501s |
| Started | 2026-05-09T08:21:54+00:00 |
| Ended | 2026-05-09T08:30:17+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, mhpco.ts, types.ts
- **Implementation LOC** (total): 303
- **Test file**: mhpco.spec.ts
- **Test file LOC**: 268
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (17 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-21-54_claim-office-prose_v1-oneshot_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-21-54_claim-office-prose_v1-oneshot_haiku-4-5

 ✓ src/mhpco.spec.ts  (17 tests) 3ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  14:55:33
   Duration  350ms (transform 30ms, setup 0ms, collect 28ms, tests 3ms, environment 0ms, prepare 64ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 75% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 81 | ×1 | 81 |
| Invocations | 66 | ×2 | 132 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 11 | ×5 | 55 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **716** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 221 |
| Functions | 2 |
| Longest Function | 28 lines |
| Avg LOC/Function | 24.50 |
| Median LOC/Function | 24.50 |
| Imports | 3 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 7 |
| Code Quality | 0 |
| **Total** | **8** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.38 | 0 |
| Cognitive (SonarJS) | 9 | 5.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5007491 |
| Context Utilization | 31% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 122.79s |
| Avg Red Phase | 0s |
| Avg Green Phase | 122.79s |
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
| Tests Passed Immediately | 1 |


