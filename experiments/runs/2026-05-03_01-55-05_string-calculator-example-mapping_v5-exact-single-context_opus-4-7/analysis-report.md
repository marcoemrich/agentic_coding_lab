# Analysis Report: 2026-05-03_01-55-05_string-calculator-example-mapping_v5-exact-single-context_opus-4-7

Generated: 2026-05-03T11:07:28+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | string-calculator-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 212s |
| Started | 2026-05-03T01:55:05+00:00 |
| Ended | 2026-05-03T01:58:37+00:00 |

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

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_01-55-05_string-calculator-example-mapping_v5-exact-single-context_opus-4-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_01-55-05_string-calculator-example-mapping_v5-exact-single-context_opus-4-7

 ✓ src/string-calculator.spec.ts  (4 tests) 2ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  11:07:29
   Duration  373ms (transform 21ms, setup 1ms, collect 17ms, tests 2ms, environment 0ms, prepare 59ms)
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
| Total Tokens | 4073267 |
| Context Utilization | 42% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 47.30s |
| Avg Red Phase | 16.03s |
| Avg Green Phase | 8.99s |
| Avg Refactor Phase | 22.28s |

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


