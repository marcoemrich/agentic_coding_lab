# Analysis Report: 2026-07-25_18-58-58_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty-4

Generated: 2026-07-25T19:39:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-8-requesty |
| Model Version(s) | claude-opus-4-8 |
| Thinking | true |
| Duration | 2443s |
| Started | 2026-07-25T18:58:58+00:00 |
| Ended | 2026-07-25T19:39:44+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 263
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 261
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_18-58-58_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_18-58-58_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty-4

 ✓ src/claim-office.spec.ts  (38 tests) 6ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  19:39:45
   Duration  184ms (transform 40ms, setup 0ms, collect 40ms, tests 6ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 8 | ×5 | 40 |
| Assignments | 112 | ×6 | 672 |
| **Total Mass** | | | **976** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 219 |
| Functions | 23 |
| Longest Function | 25 lines |
| Avg LOC/Function | 4.48 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 4 | 1.37 | 0 |
| Cognitive (SonarJS) | 2 | 1.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 37985796 |
| Context Utilization | 155% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 96.40s |
| Avg Red Phase | 24.51s |
| Avg Green Phase | 19.91s |
| Avg Refactor Phase | 51.98s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 75 |
| Predictions Total | 76 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 16 |


