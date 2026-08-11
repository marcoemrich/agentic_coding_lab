# Analysis Report: 2026-08-10_16-36-44_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-10T17:18:04+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2479s |
| Started | 2026-08-10T16:36:44+00:00 |
| Ended | 2026-08-10T17:18:04+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 298
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 587
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_16-36-44_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_16-36-44_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 8ms
 ✓ src/cli.spec.ts  (4 tests) 403ms

 Test Files  2 passed (2)
      Tests  42 passed (42)
   Start at  17:18:04
   Duration  720ms (transform 55ms, setup 0ms, collect 62ms, tests 411ms, environment 0ms, prepare 87ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 70 | ×2 | 140 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 11 | ×5 | 55 |
| Assignments | 69 | ×6 | 414 |
| **Total Mass** | | | **729** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 234 |
| Functions | 25 |
| Longest Function | 20 lines |
| Avg LOC/Function | 3.96 |
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
| McCabe (Cyclomatic) | 4 | 1.54 | 0 |
| Cognitive (SonarJS) | 3 | 1.91 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 72440326 |
| Context Utilization | 160% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 108.62s |
| Avg Red Phase | 20.31s |
| Avg Green Phase | 21.19s |
| Avg Refactor Phase | 67.12s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 84 |
| Predictions Total | 84 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 21 |


