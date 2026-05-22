# Analysis Report: 2026-05-21_18-20-23_claim-office-lite-prose_v5-exact-single-context_opus-4-6-portkey

Generated: 2026-05-21T18:52:11+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 1907s |
| Started | 2026-05-21T18:20:23+00:00 |
| Ended | 2026-05-21T18:52:11+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 105
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 63
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_18-20-23_claim-office-lite-prose_v5-exact-single-context_opus-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_18-20-23_claim-office-lite-prose_v5-exact-single-context_opus-4-6-portkey

 ✓ src/claim-office.spec.ts  (14 tests) 4ms

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  18:52:12
   Duration  162ms (transform 32ms, setup 0ms, collect 31ms, tests 4ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 80% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 43 | ×1 | 43 |
| Invocations | 32 | ×2 | 64 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 2 | ×5 | 10 |
| Assignments | 41 | ×6 | 246 |
| **Total Mass** | | | **399** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 91 |
| Functions | 5 |
| Longest Function | 28 lines |
| Avg LOC/Function | 11.20 |
| Median LOC/Function | 10.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.71 | 0 |
| Cognitive (SonarJS) | 12 | 5.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 438956 |
| Context Utilization | 18% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


