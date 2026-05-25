# Analysis Report: 2026-05-25_16-40-46_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash

Generated: 2026-05-25T16:47:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | gemini-3-5-flash |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 404s |
| Started | 2026-05-25T16:40:46+00:00 |
| Ended | 2026-05-25T16:47:31+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 219
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 868
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_16-40-46_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_16-40-46_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash

 ✓ src/claim-office.spec.ts  (36 tests) 6ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  16:47:31
   Duration  176ms (transform 42ms, setup 0ms, collect 42ms, tests 6ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 82 | ×1 | 82 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 22 | ×4 | 88 |
| Loops | 12 | ×5 | 60 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **666** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 162 |
| Functions | 5 |
| Longest Function | 79 lines |
| Avg LOC/Function | 38.20 |
| Median LOC/Function | 18.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 6 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **21** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 19 | 7.43 | 2 |
| Cognitive (SonarJS) | 25 | 12.80 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7468985 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
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
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


