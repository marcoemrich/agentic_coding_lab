# Analysis Report: 2026-08-17_08-46-28_claim-office-example-mapping_v6.2-with-why-cleaned_opus-5-no-thinking

Generated: 2026-08-17T10:12:57+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 5188s |
| Started | 2026-08-17T08:46:28+00:00 |
| Ended | 2026-08-17T10:12:57+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 507
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 680
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_08-46-28_claim-office-example-mapping_v6.2-with-why-cleaned_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_08-46-28_claim-office-example-mapping_v6.2-with-why-cleaned_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (46 tests) 598ms

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  10:12:58
   Duration  821ms (transform 57ms, setup 0ms, collect 58ms, tests 598ms, environment 0ms, prepare 70ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 107 | ×1 | 107 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 28 | ×5 | 140 |
| Assignments | 94 | ×6 | 564 |
| **Total Mass** | | | **1025** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 390 |
| Functions | 33 |
| Longest Function | 32 lines |
| Avg LOC/Function | 3.76 |
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
| McCabe (Cyclomatic) | 4 | 1.35 | 0 |
| Cognitive (SonarJS) | 2 | 1.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 118819082 |
| Context Utilization | 210% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 46 |
| Avg Cycle Time | 130.99s |
| Avg Red Phase | 25.07s |
| Avg Green Phase | 32.93s |
| Avg Refactor Phase | 72.99s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 92 |
| Predictions Total | 92 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 46 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 27 |


