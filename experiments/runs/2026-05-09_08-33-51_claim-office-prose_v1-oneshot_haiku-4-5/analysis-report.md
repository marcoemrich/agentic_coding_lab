# Analysis Report: 2026-05-09_08-33-51_claim-office-prose_v1-oneshot_haiku-4-5

Generated: 2026-05-10T14:55:54+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v1-oneshot |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 311s |
| Started | 2026-05-09T08:33:51+00:00 |
| Ended | 2026-05-09T08:39:04+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, mhpco.ts, types.ts
- **Implementation LOC** (total): 342
- **Test file**: mhpco.spec.ts
- **Test file LOC**: 255
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (18 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-33-51_claim-office-prose_v1-oneshot_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-33-51_claim-office-prose_v1-oneshot_haiku-4-5

 ✓ src/mhpco.spec.ts  (18 tests) 3ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  14:55:55
   Duration  373ms (transform 29ms, setup 0ms, collect 27ms, tests 3ms, environment 0ms, prepare 94ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 57% |
| Branches | 80% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 83 | ×1 | 83 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 19 | ×5 | 95 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **806** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 256 |
| Functions | 7 |
| Longest Function | 60 lines |
| Avg LOC/Function | 17.00 |
| Median LOC/Function | 9.00 |
| Imports | 4 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 6 |
| Duplication | 0 |
| Magic Numbers | 17 |
| Code Quality | 0 |
| **Total** | **23** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 15 | 4.30 | 1 |
| Cognitive (SonarJS) | 28 | 7.43 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6740777 |
| Context Utilization | 38% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 39.21s |
| Avg Red Phase | 7.3s |
| Avg Green Phase | 31.91s |
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


