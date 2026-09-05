# Analysis Report: 2026-09-04_22-18-15_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-3

Generated: 2026-09-04T22:50:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1946s |
| Started | 2026-09-04T22:18:15+00:00 |
| Ended | 2026-09-04T22:50:44+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 335
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 656
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_22-18-15_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_22-18-15_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-3

 ✓ src/claim-office.spec.ts  (43 tests) 1030ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  22:50:45
   Duration  1.38s (transform 99ms, setup 0ms, collect 99ms, tests 1.03s, environment 0ms, prepare 83ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 15 | ×5 | 75 |
| Assignments | 99 | ×6 | 594 |
| **Total Mass** | | | **908** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 274 |
| Functions | 24 |
| Longest Function | 21 lines |
| Avg LOC/Function | 4.83 |
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
| McCabe (Cyclomatic) | 6 | 1.43 | 0 |
| Cognitive (SonarJS) | 7 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 66570605 |
| Context Utilization | 143% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 110.93s |
| Avg Red Phase | 18.18s |
| Avg Green Phase | 22.33s |
| Avg Refactor Phase | 70.42s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 78 |
| Predictions Total | 78 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


