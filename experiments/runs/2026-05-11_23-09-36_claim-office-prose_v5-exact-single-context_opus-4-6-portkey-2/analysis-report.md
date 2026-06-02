# Analysis Report: 2026-05-11_23-09-36_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-2

Generated: 2026-06-02T07:53:53+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 1566s |
| Started | 2026-05-11T23:09:36+00:00 |
| Ended | 2026-05-11T23:35:44+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 112
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 347
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-11_23-09-36_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-2
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-11_23-09-36_claim-office-prose_v5-exact-single-context_opus-4-6-portkey-2

 ✓ src/claim-office.spec.ts  (14 tests) 180ms

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  07:54:04
   Duration  653ms (transform 100ms, setup 0ms, collect 49ms, tests 180ms, environment 0ms, prepare 175ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 44 | ×1 | 44 |
| Invocations | 37 | ×2 | 74 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 6 | ×5 | 30 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **440** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 101 |
| Functions | 7 |
| Longest Function | 16 lines |
| Avg LOC/Function | 10.86 |
| Median LOC/Function | 11.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **16** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 2.17 | 0 |
| Cognitive (SonarJS) | 3 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 32222721 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
| Avg Cycle Time | 112.79s |
| Avg Red Phase | 33.64s |
| Avg Green Phase | 36.95s |
| Avg Refactor Phase | 42.2s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


