# Analysis Report: 2026-05-15_12-51-19_claim-office-example-mapping_v6-hybrid_opus-4-7-no-thinking

Generated: 2026-05-15T13:08:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1058s |
| Started | 2026-05-15T12:51:19+00:00 |
| Ended | 2026-05-15T13:08:58+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 207
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 357
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-15_12-51-19_claim-office-example-mapping_v6-hybrid_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-15_12-51-19_claim-office-example-mapping_v6-hybrid_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (35 tests) 8ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  13:08:59
   Duration  221ms (transform 54ms, setup 0ms, collect 54ms, tests 8ms, environment 0ms, prepare 52ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 66 | ×2 | 132 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 10 | ×5 | 50 |
| Assignments | 91 | ×6 | 546 |
| **Total Mass** | | | **871** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 187 |
| Functions | 13 |
| Longest Function | 27 lines |
| Avg LOC/Function | 8.54 |
| Median LOC/Function | 8.00 |
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
| McCabe (Cyclomatic) | 12 | 2.89 | 1 |
| Cognitive (SonarJS) | 14 | 4.30 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 21492140 |
| Context Utilization | 14% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 175.05s |
| Avg Red Phase | 21.83s |
| Avg Green Phase | 110.73s |
| Avg Refactor Phase | 42.49s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 13 |
| Predictions Total | 13 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


