# Analysis Report: 2026-05-23_00-26-56_claim-office-example-mapping_v8b-delayed-refactor-native_opus-4-7-portkey-no-thinking

Generated: 2026-05-23T11:59:01+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v8b-delayed-refactor-native |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 246s |
| Started | 2026-05-23T00:26:56+00:00 |
| Ended | 2026-05-23T00:31:03+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, pricing.ts, runner.ts, types.ts
- **Implementation LOC** (total): 328
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 500
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-23_00-26-56_claim-office-example-mapping_v8b-delayed-refactor-native_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-23_00-26-56_claim-office-example-mapping_v8b-delayed-refactor-native_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests) 7ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  11:59:02
   Duration  384ms (transform 41ms, setup 0ms, collect 41ms, tests 7ms, environment 0ms, prepare 68ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 80 | ×1 | 80 |
| Invocations | 121 | ×2 | 242 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 15 | ×5 | 75 |
| Assignments | 64 | ×6 | 384 |
| **Total Mass** | | | **861** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 268 |
| Functions | 22 |
| Longest Function | 22 lines |
| Avg LOC/Function | 8.73 |
| Median LOC/Function | 6.50 |
| Imports | 8 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.21 | 0 |
| Cognitive (SonarJS) | 8 | 2.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3325401 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 41.43s |
| Avg Red Phase | 0s |
| Avg Green Phase | 30.02s |
| Avg Refactor Phase | 11.41s |

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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


