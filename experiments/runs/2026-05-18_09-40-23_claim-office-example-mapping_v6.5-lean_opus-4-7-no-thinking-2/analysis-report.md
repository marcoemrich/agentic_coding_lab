# Analysis Report: 2026-05-18_09-40-23_claim-office-example-mapping_v6.5-lean_opus-4-7-no-thinking-2

Generated: 2026-05-18T10:39:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-lean |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3524s |
| Started | 2026-05-18T09:40:23+00:00 |
| Ended | 2026-05-18T10:39:08+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 268
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 587
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_09-40-23_claim-office-example-mapping_v6.5-lean_opus-4-7-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_09-40-23_claim-office-example-mapping_v6.5-lean_opus-4-7-no-thinking-2

 ✓ src/claim-office.spec.ts  (38 tests) 5ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  10:39:09
   Duration  185ms (transform 41ms, setup 0ms, collect 43ms, tests 5ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 92 | ×6 | 552 |
| **Total Mass** | | | **863** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 215 |
| Functions | 34 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.38 |
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
| McCabe (Cyclomatic) | 3 | 1.30 | 0 |
| Cognitive (SonarJS) | 3 | 1.31 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 50451180 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 110.80s |
| Avg Red Phase | 25.96s |
| Avg Green Phase | 28.19s |
| Avg Refactor Phase | 56.65s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 78 |
| Predictions Total | 78 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 29 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 10 |


