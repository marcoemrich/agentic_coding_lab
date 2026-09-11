# Analysis Report: 2026-09-11_00-37-13_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking-2

Generated: 2026-09-11T01:18:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | sonnet-5-native-no-thinking |
| Model Version(s) | claude-sonnet-5 |
| Thinking | unknown |
| Duration | 2465s |
| Started | 2026-09-11T00:37:13+00:00 |
| Ended | 2026-09-11T01:18:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 277
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 743
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-11_00-37-13_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-11_00-37-13_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking-2

 ✓ src/claim-office.spec.ts  (45 tests) 10ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  01:18:21
   Duration  278ms (transform 72ms, setup 1ms, collect 73ms, tests 10ms, environment 0ms, prepare 67ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 62 | ×2 | 124 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 11 | ×5 | 55 |
| Assignments | 99 | ×6 | 594 |
| **Total Mass** | | | **885** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 221 |
| Functions | 20 |
| Longest Function | 19 lines |
| Avg LOC/Function | 5.75 |
| Median LOC/Function | 6.50 |
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
| McCabe (Cyclomatic) | 4 | 1.83 | 0 |
| Cognitive (SonarJS) | 4 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 121012748 |
| Context Utilization | 219% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 99.58s |
| Avg Red Phase | 18.26s |
| Avg Green Phase | 22.75s |
| Avg Refactor Phase | 58.57s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 52 |
| Predictions Total | 52 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 21 |


