# Analysis Report: 2026-09-04_23-11-22_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-3

Generated: 2026-09-05T00:00:29+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2942s |
| Started | 2026-09-04T23:11:22+00:00 |
| Ended | 2026-09-05T00:00:29+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 483
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 713
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_23-11-22_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_23-11-22_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-3

 ✓ src/claim-office.spec.ts  (40 tests) 11ms
unknown item type: broomstick
 ✓ src/cli.spec.ts  (2 tests) 964ms

 Test Files  2 passed (2)
      Tests  42 passed (42)
   Start at  00:00:30
   Duration  1.43s (transform 78ms, setup 0ms, collect 85ms, tests 975ms, environment 0ms, prepare 137ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 46 | ×1 | 46 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 16 | ×5 | 80 |
| Assignments | 131 | ×6 | 786 |
| **Total Mass** | | | **1114** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 326 |
| Functions | 38 |
| Longest Function | 12 lines |
| Avg LOC/Function | 2.87 |
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
| McCabe (Cyclomatic) | 3 | 1.16 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 88264861 |
| Context Utilization | 180% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 112.90s |
| Avg Red Phase | 19.77s |
| Avg Green Phase | 23.75s |
| Avg Refactor Phase | 69.38s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 83 |
| Predictions Total | 84 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 21 |


