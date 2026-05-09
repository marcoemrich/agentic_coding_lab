# Analysis Report: 2026-05-09_08-08-46_claim-office-prose_v1-oneshot_sonnet-4-6

Generated: 2026-05-09T11:13:34+02:00

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

- **Implementation file**: engine.ts
- **Implementation LOC**: 153
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

 ✓ src/engine.spec.ts  (31 tests) 8ms

 Test Files  1 passed (1)
      Tests  31 passed (31)
   Start at  11:13:35
   Duration  398ms (transform 64ms, setup 0ms, collect 38ms, tests 8ms, environment 0ms, prepare 179ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 57 | ×2 | 114 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 10 | ×5 | 50 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **550** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 122 |
| Functions | 8 |
| Longest Function | 29 lines |
| Avg LOC/Function | 8 |
| Imports | 1 |

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


