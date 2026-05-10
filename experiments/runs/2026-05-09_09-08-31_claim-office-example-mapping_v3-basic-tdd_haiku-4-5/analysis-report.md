# Analysis Report: 2026-05-09_09-08-31_claim-office-example-mapping_v3-basic-tdd_haiku-4-5

Generated: 2026-05-10T14:56:50+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 310s |
| Started | 2026-05-09T09:08:31+00:00 |
| Ended | 2026-05-09T09:13:44+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, core.ts, types.ts
- **Implementation LOC** (total): 327
- **Test file**: core.spec.ts
- **Test file LOC**: 534
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_09-08-31_claim-office-example-mapping_v3-basic-tdd_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_09-08-31_claim-office-example-mapping_v3-basic-tdd_haiku-4-5

 ✓ src/core.spec.ts  (41 tests) 7ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  14:56:50
   Duration  365ms (transform 36ms, setup 0ms, collect 33ms, tests 7ms, environment 0ms, prepare 91ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 72% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 78 | ×1 | 78 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 24 | ×4 | 96 |
| Loops | 15 | ×5 | 75 |
| Assignments | 70 | ×6 | 420 |
| **Total Mass** | | | **829** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 251 |
| Functions | 8 |
| Longest Function | 63 lines |
| Avg LOC/Function | 22.75 |
| Median LOC/Function | 12.50 |
| Imports | 3 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 9 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **9** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 5.33 | 2 |
| Cognitive (SonarJS) | 20 | 7.62 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6865121 |
| Context Utilization | 46% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 27.33s |
| Avg Red Phase | 16.55s |
| Avg Green Phase | 8.04s |
| Avg Refactor Phase | 2.74s |

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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


