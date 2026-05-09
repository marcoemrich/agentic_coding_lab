# Analysis Report: 2026-05-09_08-00-47_claim-office-prose_v1-oneshot_sonnet-4-6

Generated: 2026-05-09T11:13:24+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v1-oneshot |
| Model | sonnet-4-6 |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 458s |
| Started | 2026-05-09T08:00:47+00:00 |
| Ended | 2026-05-09T08:08:28+00:00 |

## Code Metrics

- **Implementation file**: claim.ts
- **Implementation LOC**: 37
- **Test file**: claim.spec.ts
- **Test file LOC**: 138
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (32 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-00-47_claim-office-prose_v1-oneshot_sonnet-4-6
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-00-47_claim-office-prose_v1-oneshot_sonnet-4-6

 ✓ src/claim.spec.ts  (13 tests) 2ms
 ✓ src/quote.spec.ts  (19 tests) 3ms

 Test Files  2 passed (2)
      Tests  32 passed (32)
   Start at  11:13:24
   Duration  352ms (transform 51ms, setup 0ms, collect 59ms, tests 5ms, environment 0ms, prepare 135ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 75% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 15 | ×1 | 15 |
| Invocations | 13 | ×2 | 26 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 1 | ×5 | 5 |
| Assignments | 7 | ×6 | 42 |
| **Total Mass** | | | **100** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 22 |
| Functions | 2 |
| Longest Function | 13 lines |
| Avg LOC/Function | 7 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 18 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.33 | 0 |
| Cognitive (SonarJS) | 10 | 4.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2981252 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 47.81s |
| Avg Red Phase | 23.98s |
| Avg Green Phase | 23.83s |
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


