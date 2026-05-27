# Analysis Report: 2026-05-27_17-48-05_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-7-no-thinking-2

Generated: 2026-05-27T19:15:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-metric-driven-refactor |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 5236s |
| Started | 2026-05-27T17:48:05+00:00 |
| Ended | 2026-05-27T19:15:22+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 218
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 453
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-27_17-48-05_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-7-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-27_17-48-05_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-7-no-thinking-2

 ✓ src/claim-office.spec.ts  (39 tests) 7ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  19:15:22
   Duration  174ms (transform 40ms, setup 0ms, collect 40ms, tests 7ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 6 | ×5 | 30 |
| Assignments | 97 | ×6 | 582 |
| **Total Mass** | | | **852** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 178 |
| Functions | 25 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.84 |
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
| McCabe (Cyclomatic) | 3 | 1.38 | 0 |
| Cognitive (SonarJS) | 3 | 1.29 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 94438673 |
| Context Utilization | 37% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 181.47s |
| Avg Red Phase | 29.75s |
| Avg Green Phase | 37.63s |
| Avg Refactor Phase | 114.09s |

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
| Refactorings Applied | 28 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


