# Analysis Report: 2026-05-03_00-33-22_string-calculator-prose_v4-exact-subagents_opus-4-7

Generated: 2026-05-03T11:06:16+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | string-calculator-prose |
| Workflow | v4-exact-subagents |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 358s |
| Started | 2026-05-03T00:33:22+00:00 |
| Ended | 2026-05-03T00:39:21+00:00 |

## Code Metrics

- **Implementation file**: string-calculator.ts
- **Implementation LOC**: 2
- **Test file**: string-calculator.spec.ts
- **Test file LOC**: 17
- **Active tests**: 4
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (4 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_00-33-22_string-calculator-prose_v4-exact-subagents_opus-4-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_00-33-22_string-calculator-prose_v4-exact-subagents_opus-4-7

 ✓ src/string-calculator.spec.ts  (4 tests) 2ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  11:06:17
   Duration  336ms (transform 20ms, setup 0ms, collect 18ms, tests 2ms, environment 0ms, prepare 50ms)
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
| Invocations | 3 | ×2 | 6 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 1 | ×5 | 5 |
| Assignments | 2 | ×6 | 12 |
| **Total Mass** | | | **25** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 2 |
| Functions | 1 |
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
| Total Tokens | 1349881 |
| Context Utilization | 30% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 68.01s |
| Avg Red Phase | 20.88s |
| Avg Green Phase | 15.58s |
| Avg Refactor Phase | 31.55s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 5 |
| Predictions Total | 5 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


