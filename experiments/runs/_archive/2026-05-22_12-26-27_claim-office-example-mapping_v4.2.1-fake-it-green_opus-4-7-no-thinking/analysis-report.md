# Analysis Report: 2026-05-22_12-26-27_claim-office-example-mapping_v4.2.1-fake-it-green_opus-4-7-no-thinking

Generated: 2026-05-22T13:57:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.2.1-fake-it-green |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 5488s |
| Started | 2026-05-22T12:26:27+00:00 |
| Ended | 2026-05-22T13:57:56+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 295
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 460
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-22_12-26-27_claim-office-example-mapping_v4.2.1-fake-it-green_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-22_12-26-27_claim-office-example-mapping_v4.2.1-fake-it-green_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 2139ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  13:57:57
   Duration  2.31s (transform 38ms, setup 0ms, collect 38ms, tests 2.14s, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 66% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 14 | ×5 | 70 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **700** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 251 |
| Functions | 18 |
| Longest Function | 42 lines |
| Avg LOC/Function | 7.11 |
| Median LOC/Function | 5.50 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.93 | 0 |
| Cognitive (SonarJS) | 4 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 24492484 |
| Context Utilization | 18% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 133.49s |
| Avg Red Phase | 47.78s |
| Avg Green Phase | 39.66s |
| Avg Refactor Phase | 46.05s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 105 |
| Predictions Total | 112 |
| Accuracy | 93% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 30 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 13 |


