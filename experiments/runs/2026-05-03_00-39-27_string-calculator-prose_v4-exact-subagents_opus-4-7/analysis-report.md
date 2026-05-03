# Analysis Report: 2026-05-03_00-39-27_string-calculator-prose_v4-exact-subagents_opus-4-7

Generated: 2026-05-03T11:06:21+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | string-calculator-prose |
| Workflow | v4-exact-subagents |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 334s |
| Started | 2026-05-03T00:39:27+00:00 |
| Ended | 2026-05-03T00:45:02+00:00 |

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

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_00-39-27_string-calculator-prose_v4-exact-subagents_opus-4-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_00-39-27_string-calculator-prose_v4-exact-subagents_opus-4-7

 ✓ src/string-calculator.spec.ts  (4 tests) 2ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  11:06:21
   Duration  314ms (transform 21ms, setup 0ms, collect 16ms, tests 2ms, environment 0ms, prepare 57ms)
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
| Invocations | 5 | ×2 | 10 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 1 | ×5 | 5 |
| Assignments | 1 | ×6 | 6 |
| **Total Mass** | | | **29** |

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
| Total Tokens | 1196787 |
| Context Utilization | 29% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 71.52s |
| Avg Red Phase | 22.78s |
| Avg Green Phase | 16.31s |
| Avg Refactor Phase | 32.43s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


