# Analysis Report: 2026-05-08_11-21-44_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

Generated: 2026-05-10T14:53:17+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v1-oneshot |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 223s |
| Started | 2026-05-08T11:21:44+00:00 |
| Ended | 2026-05-08T11:25:29+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, pricing.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 361
- **Test file**: claims.spec.ts
- **Test file LOC**: 112
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (24 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-21-44_claim-office-prose_v1-oneshot_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-08_11-21-44_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

 ✓ src/claims.spec.ts  (7 tests) 3ms
 ✓ src/scenario.spec.ts  (3 tests) 3ms
 ✓ src/pricing.spec.ts  (14 tests) 3ms

 Test Files  3 passed (3)
      Tests  24 passed (24)
   Start at  14:53:18
   Duration  457ms (transform 99ms, setup 0ms, collect 125ms, tests 9ms, environment 0ms, prepare 320ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 93 | ×1 | 93 |
| Invocations | 97 | ×2 | 194 |
| Conditionals | 24 | ×4 | 96 |
| Loops | 14 | ×5 | 70 |
| Assignments | 68 | ×6 | 408 |
| **Total Mass** | | | **861** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 288 |
| Functions | 13 |
| Longest Function | 40 lines |
| Avg LOC/Function | 16.15 |
| Median LOC/Function | 11.00 |
| Imports | 7 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.23 | 0 |
| Cognitive (SonarJS) | 11 | 3.45 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2075701 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 85.60s |
| Avg Red Phase | 30.56s |
| Avg Green Phase | 55.04s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | N/A |
| Predictions Total | N/A |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


