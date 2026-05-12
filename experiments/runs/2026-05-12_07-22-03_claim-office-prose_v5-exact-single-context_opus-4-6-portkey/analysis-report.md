# Analysis Report: 2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_opus-4-6-portkey

Generated: 2026-05-12T07:47:28+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 1521s |
| Started | 2026-05-12T07:22:03+00:00 |
| Ended | 2026-05-12T07:47:27+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 122
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 217
- **Active tests**: 11
- **Remaining todos**: 6

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_opus-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_opus-4-6-portkey

 ✓ src/claim-office.spec.ts  (17 tests | 6 skipped) 18ms

 Test Files  1 passed (1)
      Tests  11 passed | 6 todo (17)
   Start at  07:47:28
   Duration  212ms (transform 37ms, setup 0ms, collect 34ms, tests 18ms, environment 0ms, prepare 59ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 43 | ×1 | 43 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 4 | ×5 | 20 |
| Assignments | 39 | ×6 | 234 |
| **Total Mass** | | | **363** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 101 |
| Functions | 2 |
| Longest Function | 56 lines |
| Avg LOC/Function | 30.00 |
| Median LOC/Function | 30.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **14** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 4.67 | 1 |
| Cognitive (SonarJS) | 29 | 15.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 27177964 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 133.24s |
| Avg Red Phase | 36.33s |
| Avg Green Phase | 32.7s |
| Avg Refactor Phase | 64.21s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 20 |
| Predictions Total | 22 |
| Accuracy | 90% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


