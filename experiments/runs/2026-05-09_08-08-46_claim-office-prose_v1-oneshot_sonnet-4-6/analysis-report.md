# Analysis Report: 2026-05-09_08-08-46_claim-office-prose_v1-oneshot_sonnet-4-6

Generated: 2026-05-10T14:55:12+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v1-oneshot |
| Model | sonnet-4-6 |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 394s |
| Started | 2026-05-09T08:08:46+00:00 |
| Ended | 2026-05-09T08:15:22+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, engine.ts, types.ts
- **Implementation LOC** (total): 228
- **Test file**: engine.spec.ts
- **Test file LOC**: 376
- **Active tests**: 31
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (31 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-08-46_claim-office-prose_v1-oneshot_sonnet-4-6
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-08-46_claim-office-prose_v1-oneshot_sonnet-4-6

 ✓ src/engine.spec.ts  (31 tests) 5ms

 Test Files  1 passed (1)
      Tests  31 passed (31)
   Start at  14:55:12
   Duration  361ms (transform 34ms, setup 0ms, collect 32ms, tests 5ms, environment 0ms, prepare 60ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 70 | ×2 | 140 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 11 | ×5 | 55 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **623** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 183 |
| Functions | 9 |
| Longest Function | 29 lines |
| Avg LOC/Function | 8.89 |
| Median LOC/Function | 5.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 3.18 | 0 |
| Cognitive (SonarJS) | 10 | 4.38 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2126762 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 17.05s |
| Avg Red Phase | 2.56s |
| Avg Green Phase | 14.49s |
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


