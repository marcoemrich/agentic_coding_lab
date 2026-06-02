# Analysis Report: 2026-05-12_07-22-02_claim-office-prose_v5-exact-single-context_opus-4-6-portkey

Generated: 2026-06-02T08:04:24+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 1447s |
| Started | 2026-05-12T07:22:02+00:00 |
| Ended | 2026-05-12T07:46:12+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 130
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 298
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_07-22-02_claim-office-prose_v5-exact-single-context_opus-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_07-22-02_claim-office-prose_v5-exact-single-context_opus-4-6-portkey

 ✓ src/claim-office.spec.ts  (14 tests) 4ms

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  08:04:26
   Duration  326ms (transform 39ms, setup 0ms, collect 31ms, tests 4ms, environment 0ms, prepare 101ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 44 | ×2 | 88 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 6 | ×5 | 30 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **529** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 119 |
| Functions | 7 |
| Longest Function | 30 lines |
| Avg LOC/Function | 10.00 |
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
| McCabe (Cyclomatic) | 5 | 1.80 | 0 |
| Cognitive (SonarJS) | 7 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 31845051 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
| Avg Cycle Time | 103.65s |
| Avg Red Phase | 32.76s |
| Avg Green Phase | 29.22s |
| Avg Refactor Phase | 41.67s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 28 |
| Predictions Total | 28 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


