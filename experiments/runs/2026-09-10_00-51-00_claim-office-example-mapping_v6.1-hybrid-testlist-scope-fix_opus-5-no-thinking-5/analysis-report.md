# Analysis Report: 2026-09-10_00-51-00_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-5

Generated: 2026-09-10T01:48:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3471s |
| Started | 2026-09-10T00:51:00+00:00 |
| Ended | 2026-09-10T01:48:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 361
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 691
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-10_00-51-00_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-10_00-51-00_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-5

 ✓ src/claim-office.spec.ts  (46 tests) 608ms

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  01:48:53
   Duration  789ms (transform 50ms, setup 0ms, collect 51ms, tests 608ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 75 | ×1 | 75 |
| Invocations | 69 | ×2 | 138 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 11 | ×5 | 55 |
| Assignments | 81 | ×6 | 486 |
| **Total Mass** | | | **814** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 281 |
| Functions | 27 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.85 |
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
| McCabe (Cyclomatic) | 3 | 1.41 | 0 |
| Cognitive (SonarJS) | 2 | 1.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 81047575 |
| Context Utilization | 156% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 46 |
| Avg Cycle Time | 82.52s |
| Avg Red Phase | 14.6s |
| Avg Green Phase | 13.33s |
| Avg Refactor Phase | 54.59s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 90 |
| Predictions Total | 92 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 46 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 27 |


