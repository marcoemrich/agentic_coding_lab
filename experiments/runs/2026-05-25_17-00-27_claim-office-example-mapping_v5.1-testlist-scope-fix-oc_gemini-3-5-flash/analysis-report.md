# Analysis Report: 2026-05-25_17-00-27_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash

Generated: 2026-05-25T17:10:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | gemini-3-5-flash |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 603s |
| Started | 2026-05-25T17:00:27+00:00 |
| Ended | 2026-05-25T17:10:31+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 258
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 596
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_17-00-27_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_17-00-27_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_gemini-3-5-flash

 ✓ src/claim-office.spec.ts  (35 tests) 6ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  17:10:32
   Duration  194ms (transform 42ms, setup 0ms, collect 55ms, tests 6ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 85 | ×1 | 85 |
| Invocations | 59 | ×2 | 118 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 11 | ×5 | 55 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **680** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 202 |
| Functions | 3 |
| Longest Function | 154 lines |
| Avg LOC/Function | 60.00 |
| Median LOC/Function | 15.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 9 |
| Duplication | 0 |
| Magic Numbers | 20 |
| Code Quality | 0 |
| **Total** | **29** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 39 | 9.80 | 1 |
| Cognitive (SonarJS) | 81 | 29.33 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12473291 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


