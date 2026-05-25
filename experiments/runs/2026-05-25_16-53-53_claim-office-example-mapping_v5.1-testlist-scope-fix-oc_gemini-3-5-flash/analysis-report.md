# Analysis Report: 2026-05-25_16-53-53_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash

Generated: 2026-05-25T17:00:11+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | gemini-3-5-flash |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 376s |
| Started | 2026-05-25T16:53:53+00:00 |
| Ended | 2026-05-25T17:00:11+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 205
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 727
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_16-53-53_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_16-53-53_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash

 ✓ src/claim-office.spec.ts  (30 tests) 6ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  17:00:11
   Duration  183ms (transform 43ms, setup 0ms, collect 44ms, tests 6ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 100 | ×1 | 100 |
| Invocations | 54 | ×2 | 108 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 15 | ×5 | 75 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **657** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 140 |
| Functions | 2 |
| Longest Function | 189 lines |
| Avg LOC/Function | 100.00 |
| Median LOC/Function | 100.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 17 |
| Code Quality | 0 |
| **Total** | **20** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 38 | 10.50 | 1 |
| Cognitive (SonarJS) | 70 | 35.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7349620 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


