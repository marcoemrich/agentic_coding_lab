# Analysis Report: 2026-09-10_19-13-08_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-no-thinking-3

Generated: 2026-09-10T19:59:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | fable-5-no-thinking |
| Model Version(s) | claude-fable-5 |
| Thinking | unknown |
| Duration | 2801s |
| Started | 2026-09-10T19:13:08+00:00 |
| Ended | 2026-09-10T19:59:52+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 257
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 608
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-10_19-13-08_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-10_19-13-08_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-no-thinking-3

 ✓ src/claim-office.spec.ts  (37 tests) 781ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  19:59:53
   Duration  1.07s (transform 74ms, setup 0ms, collect 73ms, tests 781ms, environment 0ms, prepare 71ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 59 | ×2 | 118 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 4 | ×5 | 20 |
| Assignments | 69 | ×6 | 414 |
| **Total Mass** | | | **639** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 212 |
| Functions | 18 |
| Longest Function | 14 lines |
| Avg LOC/Function | 4.44 |
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
| McCabe (Cyclomatic) | 3 | 1.55 | 0 |
| Cognitive (SonarJS) | 3 | 1.55 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 62693326 |
| Context Utilization | 154% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 104.95s |
| Avg Red Phase | 14.76s |
| Avg Green Phase | 17.66s |
| Avg Refactor Phase | 72.53s |

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
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 13 |


