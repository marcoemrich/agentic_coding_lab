# Analysis Report: 2026-09-10_10-27-38_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-no-thinking

Generated: 2026-09-10T12:42:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | fable-5-no-thinking |
| Model Version(s) | claude-fable-5 |
| Thinking | unknown |
| Duration | 8074s |
| Started | 2026-09-10T10:27:38+00:00 |
| Ended | 2026-09-10T12:42:13+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 258
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 608
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-10_10-27-38_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-10_10-27-38_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests) 262ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  12:42:14
   Duration  458ms (transform 50ms, setup 0ms, collect 49ms, tests 262ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 51 | ×2 | 102 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 10 | ×5 | 50 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **666** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 227 |
| Functions | 13 |
| Longest Function | 19 lines |
| Avg LOC/Function | 5.62 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.91 | 0 |
| Cognitive (SonarJS) | 3 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 59504100 |
| Context Utilization | 149% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 85.66s |
| Avg Red Phase | 14.51s |
| Avg Green Phase | 15.13s |
| Avg Refactor Phase | 56.02s |

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
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


