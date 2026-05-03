# Analysis Report: 2026-05-02_23-15-31_pixel-art-scaler-example-mapping_v5-exact-single-context_sonnet-4-6

Generated: 2026-05-03T11:05:40+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | pixel-art-scaler-example-mapping |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6 |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 497s |
| Started | 2026-05-02T23:15:31+00:00 |
| Ended | 2026-05-02T23:23:49+00:00 |

## Code Metrics

- **Implementation file**: pixel-art-scaler.ts
- **Implementation LOC**: 5
- **Test file**: pixel-art-scaler.spec.ts
- **Test file LOC**: 27
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (6 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-02_23-15-31_pixel-art-scaler-example-mapping_v5-exact-single-context_sonnet-4-6
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-02_23-15-31_pixel-art-scaler-example-mapping_v5-exact-single-context_sonnet-4-6

 ✓ src/pixel-art-scaler.spec.ts  (6 tests) 3ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  11:05:40
   Duration  300ms (transform 21ms, setup 0ms, collect 18ms, tests 3ms, environment 0ms, prepare 52ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 2 | ×1 | 2 |
| Invocations | 7 | ×2 | 14 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 1 | ×5 | 5 |
| Assignments | 4 | ×6 | 24 |
| **Total Mass** | | | **45** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 4 |
| Functions | 2 |
| Longest Function | 2 lines |
| Avg LOC/Function | 2 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6151403 |
| Context Utilization | 42% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 91.81s |
| Avg Red Phase | 26.65s |
| Avg Green Phase | 29.37s |
| Avg Refactor Phase | 35.79s |

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
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


