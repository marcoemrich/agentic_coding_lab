# Analysis Report: 2026-05-03_01-50-14_string-calculator-example-mapping_v4-exact-subagents_haiku-4-5

Generated: 2026-05-03T11:07:23+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | string-calculator-example-mapping |
| Workflow | v4-exact-subagents |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 283s |
| Started | 2026-05-03T01:50:14+00:00 |
| Ended | 2026-05-03T01:54:58+00:00 |

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

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_01-50-14_string-calculator-example-mapping_v4-exact-subagents_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_01-50-14_string-calculator-example-mapping_v4-exact-subagents_haiku-4-5

 ✓ src/string-calculator.spec.ts  (4 tests) 2ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  11:07:24
   Duration  357ms (transform 30ms, setup 0ms, collect 23ms, tests 2ms, environment 0ms, prepare 71ms)
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
| Loops | 2 | ×5 | 10 |
| Assignments | 2 | ×6 | 12 |
| **Total Mass** | | | **32** |

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
| Total Tokens | 2376820 |
| Context Utilization | 22% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 52.46s |
| Avg Red Phase | 14.92s |
| Avg Green Phase | 13.77s |
| Avg Refactor Phase | 23.77s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 1 |
| Predictions Total | 2 |
| Accuracy | 50% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


