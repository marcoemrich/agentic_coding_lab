# Analysis Report: 2026-05-15_11-26-09_claim-office-example-mapping_v6-hybrid_opus-4-7-no-thinking

Generated: 2026-05-15T12:14:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2883s |
| Started | 2026-05-15T11:26:09+00:00 |
| Ended | 2026-05-15T12:14:13+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 219
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 567
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-15_11-26-09_claim-office-example-mapping_v6-hybrid_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-15_11-26-09_claim-office-example-mapping_v6-hybrid_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (34 tests) 7ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  12:14:14
   Duration  205ms (transform 51ms, setup 0ms, collect 52ms, tests 7ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 10 | ×5 | 50 |
| Assignments | 91 | ×6 | 546 |
| **Total Mass** | | | **864** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 185 |
| Functions | 25 |
| Longest Function | 12 lines |
| Avg LOC/Function | 5.36 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 4 | 1.55 | 0 |
| Cognitive (SonarJS) | 5 | 1.79 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 39096785 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 33 |
| Avg Cycle Time | 151.09s |
| Avg Red Phase | 30.07s |
| Avg Green Phase | 40.87s |
| Avg Refactor Phase | 80.15s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 57 |
| Predictions Total | 57 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 14 |


