# Analysis Report: 2026-05-22_10-14-46_claim-office-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T11:26:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 4328s |
| Started | 2026-05-22T10:14:46+00:00 |
| Ended | 2026-05-22T11:26:55+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 197
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 896
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-22_10-14-46_claim-office-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-22_10-14-46_claim-office-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests) 3125ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  11:26:55
   Duration  3.33s (transform 59ms, setup 0ms, collect 60ms, tests 3.13s, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 64 | ×2 | 128 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 10 | ×5 | 50 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **640** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 180 |
| Functions | 14 |
| Longest Function | 28 lines |
| Avg LOC/Function | 6.36 |
| Median LOC/Function | 5.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.50 | 0 |
| Cognitive (SonarJS) | 6 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11616662 |
| Context Utilization | 15% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 130.88s |
| Avg Red Phase | 46.73s |
| Avg Green Phase | 38.01s |
| Avg Refactor Phase | 46.14s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 54 |
| Predictions Total | 54 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 19 |


