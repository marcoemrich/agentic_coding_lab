# Analysis Report: 2026-05-10_11-41-24_claim-office-example-mapping_v4-exact-subagents_opus-4-7

Generated: 2026-05-10T19:11:37+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 4873s |
| Started | 2026-05-10T11:41:24+00:00 |
| Ended | 2026-05-10T13:02:39+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 260
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 267
- **Active tests**: 25
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (25 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_11-41-24_claim-office-example-mapping_v4-exact-subagents_opus-4-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_11-41-24_claim-office-example-mapping_v4-exact-subagents_opus-4-7

 ✓ src/claim-office.spec.ts  (25 tests) 6ms

 Test Files  1 passed (1)
      Tests  25 passed (25)
   Start at  19:11:37
   Duration  410ms (transform 32ms, setup 0ms, collect 33ms, tests 6ms, environment 0ms, prepare 68ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 68% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 9 | ×5 | 45 |
| Assignments | 96 | ×6 | 576 |
| **Total Mass** | | | **900** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 215 |
| Functions | 33 |
| Longest Function | 19 lines |
| Avg LOC/Function | 4.58 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 9 | 1.67 | 0 |
| Cognitive (SonarJS) | 4 | 1.69 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10338307 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 25 |
| Avg Cycle Time | 197.72s |
| Avg Red Phase | 80.69s |
| Avg Green Phase | 46.39s |
| Avg Refactor Phase | 70.64s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 33 |
| Predictions Total | 34 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 7 |


