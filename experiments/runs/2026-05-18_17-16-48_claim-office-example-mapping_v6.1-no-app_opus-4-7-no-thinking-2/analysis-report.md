# Analysis Report: 2026-05-18_17-16-48_claim-office-example-mapping_v6.1-no-app_opus-4-7-no-thinking-2

Generated: 2026-05-18T17:35:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-no-app |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1147s |
| Started | 2026-05-18T17:16:48+00:00 |
| Ended | 2026-05-18T17:35:56+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 208
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 482
- **Active tests**: 28
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (28 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_17-16-48_claim-office-example-mapping_v6.1-no-app_opus-4-7-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_17-16-48_claim-office-example-mapping_v6.1-no-app_opus-4-7-no-thinking-2

 ✓ src/claim-office.spec.ts  (28 tests) 6ms

 Test Files  1 passed (1)
      Tests  28 passed (28)
   Start at  17:35:57
   Duration  171ms (transform 43ms, setup 0ms, collect 40ms, tests 6ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 69 | ×2 | 138 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 88 | ×6 | 528 |
| **Total Mass** | | | **821** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 178 |
| Functions | 18 |
| Longest Function | 22 lines |
| Avg LOC/Function | 6.44 |
| Median LOC/Function | 4.50 |
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
| McCabe (Cyclomatic) | 5 | 1.96 | 0 |
| Cognitive (SonarJS) | 6 | 2.46 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 26185118 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
| Avg Cycle Time | 125.85s |
| Avg Red Phase | 21.5s |
| Avg Green Phase | 68.44s |
| Avg Refactor Phase | 35.91s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 22 |
| Predictions Total | 22 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


