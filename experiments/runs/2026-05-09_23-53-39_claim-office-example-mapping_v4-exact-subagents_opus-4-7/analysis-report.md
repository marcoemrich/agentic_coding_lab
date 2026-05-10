# Analysis Report: 2026-05-09_23-53-39_claim-office-example-mapping_v4-exact-subagents_opus-4-7

Generated: 2026-05-10T14:59:23+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 4926s |
| Started | 2026-05-09T23:53:39+00:00 |
| Ended | 2026-05-10T01:15:47+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 268
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 387
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_23-53-39_claim-office-example-mapping_v4-exact-subagents_opus-4-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_23-53-39_claim-office-example-mapping_v4-exact-subagents_opus-4-7

 ✓ src/claim-office.spec.ts  (44 tests) 6ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  14:59:23
   Duration  388ms (transform 35ms, setup 0ms, collect 33ms, tests 6ms, environment 0ms, prepare 71ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 86 | ×1 | 86 |
| Invocations | 89 | ×2 | 178 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 17 | ×5 | 85 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **751** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 191 |
| Functions | 19 |
| Longest Function | 20 lines |
| Avg LOC/Function | 6.53 |
| Median LOC/Function | 6.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.78 | 0 |
| Cognitive (SonarJS) | 3 | 1.91 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6245162 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 23 |
| Avg Cycle Time | 109.44s |
| Avg Red Phase | 33.44s |
| Avg Green Phase | 24.64s |
| Avg Refactor Phase | 51.36s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 42 |
| Predictions Total | 43 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


