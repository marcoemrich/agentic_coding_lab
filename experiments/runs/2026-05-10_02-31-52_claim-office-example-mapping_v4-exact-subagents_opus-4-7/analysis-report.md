# Analysis Report: 2026-05-10_02-31-52_claim-office-example-mapping_v4-exact-subagents_opus-4-7

Generated: 2026-05-10T15:17:23+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 3799s |
| Started | 2026-05-10T02:31:52+00:00 |
| Ended | 2026-05-10T03:35:13+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 233
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 587
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_02-31-52_claim-office-example-mapping_v4-exact-subagents_opus-4-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_02-31-52_claim-office-example-mapping_v4-exact-subagents_opus-4-7

 ✓ src/claim-office.spec.ts  (37 tests) 6ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  15:17:24
   Duration  423ms (transform 51ms, setup 0ms, collect 49ms, tests 6ms, environment 0ms, prepare 85ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 91 | ×2 | 182 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 9 | ×5 | 45 |
| Assignments | 69 | ×6 | 414 |
| **Total Mass** | | | **758** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 199 |
| Functions | 21 |
| Longest Function | 22 lines |
| Avg LOC/Function | 6.52 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 8 | 2.46 | 0 |
| Cognitive (SonarJS) | 6 | 1.94 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12247048 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 110.51s |
| Avg Red Phase | 32.27s |
| Avg Green Phase | 25.49s |
| Avg Refactor Phase | 52.75s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 47 |
| Predictions Total | 48 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 16 |


