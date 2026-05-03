# Analysis Report: 2026-05-03_03-48-02_mars-rover-prose_v5-exact-single-context_opus-4-7

Generated: 2026-05-03T11:08:43+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | mars-rover-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 385s |
| Started | 2026-05-03T03:48:02+00:00 |
| Ended | 2026-05-03T03:54:28+00:00 |

## Code Metrics

- **Implementation file**: mars-rover.ts
- **Implementation LOC**: 32
- **Test file**: mars-rover.spec.ts
- **Test file LOC**: 29
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_03-48-02_mars-rover-prose_v5-exact-single-context_opus-4-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-03_03-48-02_mars-rover-prose_v5-exact-single-context_opus-4-7

 ✓ src/mars-rover.spec.ts  (8 tests) 2ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  11:08:44
   Duration  407ms (transform 24ms, setup 0ms, collect 20ms, tests 2ms, environment 0ms, prepare 83ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 83% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 20 | ×1 | 20 |
| Invocations | 2 | ×2 | 4 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 1 | ×5 | 5 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **95** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 27 |
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
| Total Tokens | 9480171 |
| Context Utilization | 59% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 44.94s |
| Avg Red Phase | 17.52s |
| Avg Green Phase | 12.33s |
| Avg Refactor Phase | 15.09s |

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
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


