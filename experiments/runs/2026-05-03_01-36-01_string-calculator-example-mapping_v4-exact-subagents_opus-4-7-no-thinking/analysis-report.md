# Analysis Report: 2026-05-03_01-36-01_string-calculator-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

Generated: 2026-05-03T11:07:14+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | string-calculator-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 397s |
| Started | 2026-05-03T01:36:01+00:00 |
| Ended | 2026-05-03T01:42:38+00:00 |

## Code Metrics

- **Implementation file**: string-calculator.ts
- **Implementation LOC**: 3
- **Test file**: string-calculator.spec.ts
- **Test file LOC**: 17
- **Active tests**: 4
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (4 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_01-36-01_string-calculator-example-mapping_v4-exact-subagents_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_01-36-01_string-calculator-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

 ✓ src/string-calculator.spec.ts  (4 tests) 2ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  11:07:15
   Duration  366ms (transform 20ms, setup 0ms, collect 17ms, tests 2ms, environment 0ms, prepare 48ms)
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
| Invocations | 4 | ×2 | 8 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 1 | ×5 | 5 |
| Assignments | 1 | ×6 | 6 |
| **Total Mass** | | | **21** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 3 |
| Functions | 1 |
| Longest Function | 3 lines |
| Avg LOC/Function | 3 |
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
| Total Tokens | 1303971 |
| Context Utilization | 30% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 75.31s |
| Avg Red Phase | 24.55s |
| Avg Green Phase | 17.4s |
| Avg Refactor Phase | 33.36s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 4 |
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


