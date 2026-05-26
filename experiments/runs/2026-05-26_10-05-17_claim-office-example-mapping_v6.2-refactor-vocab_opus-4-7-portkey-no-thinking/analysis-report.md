# Analysis Report: 2026-05-26_10-05-17_claim-office-example-mapping_v6.2-refactor-vocab_opus-4-7-portkey-no-thinking

Generated: 2026-05-26T10:15:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-refactor-vocab |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 634s |
| Started | 2026-05-26T10:05:17+00:00 |
| Ended | 2026-05-26T10:15:52+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 73
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 130
- **Active tests**: 8
- **Remaining todos**: 32

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_10-05-17_claim-office-example-mapping_v6.2-refactor-vocab_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_10-05-17_claim-office-example-mapping_v6.2-refactor-vocab_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests | 32 skipped) 3ms

 Test Files  1 passed (1)
      Tests  8 passed | 32 todo (40)
   Start at  10:15:53
   Duration  160ms (transform 29ms, setup 0ms, collect 27ms, tests 3ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 71% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 17 | ×1 | 17 |
| Invocations | 23 | ×2 | 46 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 3 | ×5 | 15 |
| Assignments | 23 | ×6 | 138 |
| **Total Mass** | | | **224** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 59 |
| Functions | 8 |
| Longest Function | 7 lines |
| Avg LOC/Function | 3.75 |
| Median LOC/Function | 3.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 2 | 1.36 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9209737 |
| Context Utilization | 11% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 71.97s |
| Avg Red Phase | 18.18s |
| Avg Green Phase | 12.15s |
| Avg Refactor Phase | 41.64s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 15 |
| Predictions Total | 16 |
| Accuracy | 93% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


