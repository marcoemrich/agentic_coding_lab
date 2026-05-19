# Analysis Report: 2026-05-19_06-49-45_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-2

Generated: 2026-05-19T07:48:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 3547s |
| Started | 2026-05-19T06:49:45+00:00 |
| Ended | 2026-05-19T07:48:55+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 174
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 684
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_06-49-45_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_06-49-45_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (39 tests) 8ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  07:48:56
   Duration  224ms (transform 62ms, setup 0ms, collect 64ms, tests 8ms, environment 0ms, prepare 52ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 10 | ×5 | 50 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **670** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 152 |
| Functions | 16 |
| Longest Function | 17 lines |
| Avg LOC/Function | 6.94 |
| Median LOC/Function | 6.50 |
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
| McCabe (Cyclomatic) | 6 | 1.82 | 0 |
| Cognitive (SonarJS) | 7 | 2.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 52904980 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 191.21s |
| Avg Red Phase | 34.83s |
| Avg Green Phase | 45.61s |
| Avg Refactor Phase | 110.77s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 70 |
| Predictions Total | 70 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 16 |


