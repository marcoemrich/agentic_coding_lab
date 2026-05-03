# Analysis Report: 2026-05-02_23-12-16_pixel-art-scaler-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-05-03T11:05:35+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | pixel-art-scaler-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 189s |
| Started | 2026-05-02T23:12:16+00:00 |
| Ended | 2026-05-02T23:15:25+00:00 |

## Code Metrics

- **Implementation file**: pixel-art-scaler.ts
- **Implementation LOC**: 6
- **Test file**: pixel-art-scaler.spec.ts
- **Test file LOC**: 49
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (7 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-02_23-12-16_pixel-art-scaler-example-mapping_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-02_23-12-16_pixel-art-scaler-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/pixel-art-scaler.spec.ts  (7 tests) 2ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  11:05:36
   Duration  339ms (transform 27ms, setup 0ms, collect 21ms, tests 2ms, environment 0ms, prepare 55ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 1 | ×1 | 1 |
| Invocations | 6 | ×2 | 12 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 1 | ×5 | 5 |
| Assignments | 3 | ×6 | 18 |
| **Total Mass** | | | **36** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 6 |
| Functions | 1 |
| Longest Function | 6 lines |
| Avg LOC/Function | 6 |
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
| Total Tokens | 5080991 |
| Context Utilization | 42% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 36.27s |
| Avg Red Phase | 13.98s |
| Avg Green Phase | 12.43s |
| Avg Refactor Phase | 9.86s |

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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


