# Analysis Report: 2026-05-27_17-48-05_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-7-no-thinking

Generated: 2026-05-27T18:44:07+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-metric-driven-refactor |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3361s |
| Started | 2026-05-27T17:48:05+00:00 |
| Ended | 2026-05-27T18:44:07+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 217
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 494
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-27_17-48-05_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-27_17-48-05_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 17ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  18:44:08
   Duration  196ms (transform 42ms, setup 0ms, collect 41ms, tests 17ms, environment 0ms, prepare 52ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 62 | ×2 | 124 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 9 | ×5 | 45 |
| Assignments | 74 | ×6 | 444 |
| **Total Mass** | | | **730** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 183 |
| Functions | 19 |
| Longest Function | 15 lines |
| Avg LOC/Function | 5.16 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.48 | 0 |
| Cognitive (SonarJS) | 3 | 1.42 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 102043074 |
| Context Utilization | 36% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 114.39s |
| Avg Red Phase | 19.87s |
| Avg Green Phase | 14.2s |
| Avg Refactor Phase | 80.32s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 83 |
| Predictions Total | 86 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


