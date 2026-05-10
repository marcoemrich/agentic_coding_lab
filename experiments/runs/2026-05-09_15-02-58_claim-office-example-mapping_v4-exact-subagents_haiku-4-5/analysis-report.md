# Analysis Report: 2026-05-09_15-02-58_claim-office-example-mapping_v4-exact-subagents_haiku-4-5

Generated: 2026-05-10T14:58:34+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 2578s |
| Started | 2026-05-09T15:02:58+00:00 |
| Ended | 2026-05-09T15:45:59+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 165
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 101
- **Active tests**: 28
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (28 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_15-02-58_claim-office-example-mapping_v4-exact-subagents_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_15-02-58_claim-office-example-mapping_v4-exact-subagents_haiku-4-5

 ✓ src/claim-office.spec.ts  (28 tests) 4ms

 Test Files  1 passed (1)
      Tests  28 passed (28)
   Start at  14:58:35
   Duration  339ms (transform 32ms, setup 0ms, collect 25ms, tests 4ms, environment 0ms, prepare 76ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 37 | ×2 | 74 |
| Conditionals | 24 | ×4 | 96 |
| Loops | 5 | ×5 | 25 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **526** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 126 |
| Functions | 12 |
| Longest Function | 30 lines |
| Avg LOC/Function | 9.33 |
| Median LOC/Function | 7.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 5 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 3.14 | 0 |
| Cognitive (SonarJS) | 5 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12000582 |
| Context Utilization | 48% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 28 |
| Avg Cycle Time | 86.43s |
| Avg Red Phase | 31.96s |
| Avg Green Phase | 19.93s |
| Avg Refactor Phase | 34.54s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 44 |
| Predictions Total | 50 |
| Accuracy | 88% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 25 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


