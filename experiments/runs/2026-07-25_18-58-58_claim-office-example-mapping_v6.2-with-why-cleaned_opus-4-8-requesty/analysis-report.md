# Analysis Report: 2026-07-25_18-58-58_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty

Generated: 2026-07-25T19:47:12+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-8-requesty |
| Model Version(s) | claude-opus-4-8 |
| Thinking | true |
| Duration | 2891s |
| Started | 2026-07-25T18:58:58+00:00 |
| Ended | 2026-07-25T19:47:12+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 282
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 567
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_18-58-58_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_18-58-58_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-requesty

 ✓ src/claim-office.spec.ts  (43 tests) 499ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  19:47:13
   Duration  694ms (transform 47ms, setup 0ms, collect 48ms, tests 499ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 74 | ×2 | 148 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 16 | ×5 | 80 |
| Assignments | 77 | ×6 | 462 |
| **Total Mass** | | | **800** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 218 |
| Functions | 24 |
| Longest Function | 15 lines |
| Avg LOC/Function | 4.08 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 4 | 1.45 | 0 |
| Cognitive (SonarJS) | 4 | 1.38 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 53838367 |
| Context Utilization | 194% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 94.31s |
| Avg Red Phase | 21.67s |
| Avg Green Phase | 17.28s |
| Avg Refactor Phase | 55.36s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 86 |
| Predictions Total | 86 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


