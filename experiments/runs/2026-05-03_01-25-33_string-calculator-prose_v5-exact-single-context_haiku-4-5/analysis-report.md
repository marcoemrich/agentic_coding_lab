# Analysis Report: 2026-05-03_01-25-33_string-calculator-prose_v5-exact-single-context_haiku-4-5

Generated: 2026-05-03T11:07:05+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | string-calculator-prose |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 243s |
| Started | 2026-05-03T01:25:33+00:00 |
| Ended | 2026-05-03T01:29:37+00:00 |

## Code Metrics

- **Implementation file**: string-calculator.ts
- **Implementation LOC**: 4
- **Test file**: string-calculator.spec.ts
- **Test file LOC**: 17
- **Active tests**: 4
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (4 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_01-25-33_string-calculator-prose_v5-exact-single-context_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_01-25-33_string-calculator-prose_v5-exact-single-context_haiku-4-5

 ✓ src/string-calculator.spec.ts  (4 tests) 1ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  11:07:06
   Duration  342ms (transform 19ms, setup 0ms, collect 16ms, tests 1ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 4 | ×1 | 4 |
| Invocations | 4 | ×2 | 8 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 1 | ×5 | 5 |
| Assignments | 2 | ×6 | 12 |
| **Total Mass** | | | **33** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 4 |
| Functions | 1 |
| Longest Function | 4 lines |
| Avg LOC/Function | 4 |
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
| Total Tokens | 5409625 |
| Context Utilization | 34% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 56.19s |
| Avg Red Phase | 13.9s |
| Avg Green Phase | 12.94s |
| Avg Refactor Phase | 29.35s |

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
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


