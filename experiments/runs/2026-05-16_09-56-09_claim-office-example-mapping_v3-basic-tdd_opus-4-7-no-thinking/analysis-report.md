# Analysis Report: 2026-05-16_09-56-09_claim-office-example-mapping_v3-basic-tdd_opus-4-7-no-thinking

Generated: 2026-05-23T11:52:07+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 277s |
| Started | 2026-05-16T09:56:09+00:00 |
| Ended | 2026-05-16T10:00:47+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 419
- **Test file**: premium.spec.ts
- **Test file LOC**: 152
- **Active tests**: 19
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-16_09-56-09_claim-office-example-mapping_v3-basic-tdd_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-16_09-56-09_claim-office-example-mapping_v3-basic-tdd_opus-4-7-no-thinking

 ✓ src/premium.spec.ts  (19 tests) 4ms
 ✓ src/claim.spec.ts  (19 tests) 4ms
 ✓ src/scenario.spec.ts  (3 tests) 4ms

 Test Files  3 passed (3)
      Tests  41 passed (41)
   Start at  11:52:07
   Duration  412ms (transform 78ms, setup 0ms, collect 109ms, tests 12ms, environment 1ms, prepare 333ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 94 | ×1 | 94 |
| Invocations | 129 | ×2 | 258 |
| Conditionals | 33 | ×4 | 132 |
| Loops | 19 | ×5 | 95 |
| Assignments | 72 | ×6 | 432 |
| **Total Mass** | | | **1011** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 344 |
| Functions | 13 |
| Longest Function | 34 lines |
| Avg LOC/Function | 9.15 |
| Median LOC/Function | 6.00 |
| Imports | 7 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 5 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **20** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 22 | 4.06 | 1 |
| Cognitive (SonarJS) | 28 | 6.36 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2734813 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 22.77s |
| Avg Red Phase | 0.77s |
| Avg Green Phase | 15.67s |
| Avg Refactor Phase | 6.33s |

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


