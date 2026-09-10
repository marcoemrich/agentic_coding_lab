# Analysis Report: 2026-09-10_05-35-05_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking-2

Generated: 2026-09-10T06:42:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | fable-5-1-no-thinking |
| Model Version(s) | claude-fable-5-1 |
| Thinking | unknown |
| Duration | 4029s |
| Started | 2026-09-10T05:35:05+00:00 |
| Ended | 2026-09-10T06:42:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 189
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 263
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-10_05-35-05_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-10_05-35-05_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking-2

 ✓ src/claim-office.spec.ts  (45 tests) 325ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  06:42:15
   Duration  515ms (transform 39ms, setup 1ms, collect 39ms, tests 325ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 77% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 73 | ×2 | 146 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 10 | ×5 | 50 |
| Assignments | 79 | ×6 | 474 |
| **Total Mass** | | | **771** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 140 |
| Functions | 24 |
| Longest Function | 15 lines |
| Avg LOC/Function | 4.21 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 3 | 1.50 | 0 |
| Cognitive (SonarJS) | 3 | 1.55 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 66160289 |
| Context Utilization | 132% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 45 |
| Avg Cycle Time | 62.20s |
| Avg Red Phase | 11.08s |
| Avg Green Phase | 13.03s |
| Avg Refactor Phase | 38.09s |

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
| Refactorings Applied | 26 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


