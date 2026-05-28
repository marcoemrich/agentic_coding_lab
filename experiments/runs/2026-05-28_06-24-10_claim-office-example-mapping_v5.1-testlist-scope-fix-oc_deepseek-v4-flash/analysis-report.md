# Analysis Report: 2026-05-28_06-24-10_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-flash

Generated: 2026-05-28T06:51:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | deepseek-v4-flash |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1630s |
| Started | 2026-05-28T06:24:10+00:00 |
| Ended | 2026-05-28T06:51:21+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 257
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 175
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-28_06-24-10_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-flash
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-28_06-24-10_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_deepseek-v4-flash

 ✓ src/claim-office.spec.ts  (36 tests) 5ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  06:51:21
   Duration  164ms (transform 34ms, setup 0ms, collect 32ms, tests 5ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 54% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 74 | ×1 | 74 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 25 | ×4 | 100 |
| Loops | 10 | ×5 | 50 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **740** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 212 |
| Functions | 7 |
| Longest Function | 47 lines |
| Avg LOC/Function | 22.14 |
| Median LOC/Function | 22.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 5 |
| Duplication | 0 |
| Magic Numbers | 15 |
| Code Quality | 0 |
| **Total** | **20** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 4.08 | 1 |
| Cognitive (SonarJS) | 14 | 8.71 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7522990 |
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
| Predictions Correct | 5 |
| Predictions Total | 5 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


