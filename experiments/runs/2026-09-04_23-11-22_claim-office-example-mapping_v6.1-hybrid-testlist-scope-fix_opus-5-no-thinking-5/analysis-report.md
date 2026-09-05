# Analysis Report: 2026-09-04_23-11-22_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-5

Generated: 2026-09-04T23:59:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2886s |
| Started | 2026-09-04T23:11:22+00:00 |
| Ended | 2026-09-04T23:59:32+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 304
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 624
- **Active tests**: 52
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_23-11-22_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_23-11-22_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-5

 ✓ src/claim-office.spec.ts  (52 tests) 2113ms

 Test Files  1 passed (1)
      Tests  52 passed (52)
   Start at  23:59:33
   Duration  2.42s (transform 87ms, setup 1ms, collect 87ms, tests 2.11s, environment 0ms, prepare 69ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 11 | ×5 | 55 |
| Assignments | 72 | ×6 | 432 |
| **Total Mass** | | | **762** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 230 |
| Functions | 29 |
| Longest Function | 19 lines |
| Avg LOC/Function | 4.48 |
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
| McCabe (Cyclomatic) | 4 | 1.56 | 0 |
| Cognitive (SonarJS) | 3 | 1.43 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 94117584 |
| Context Utilization | 180% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 52 |
| Avg Cycle Time | 108.78s |
| Avg Red Phase | 18.72s |
| Avg Green Phase | 20.61s |
| Avg Refactor Phase | 69.45s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 105 |
| Predictions Total | 106 |
| Accuracy | 99% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 32 |


