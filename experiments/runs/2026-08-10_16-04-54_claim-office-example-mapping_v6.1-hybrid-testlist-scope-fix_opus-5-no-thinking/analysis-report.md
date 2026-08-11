# Analysis Report: 2026-08-10_16-04-54_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-10T16:40:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2130s |
| Started | 2026-08-10T16:04:54+00:00 |
| Ended | 2026-08-10T16:40:25+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 301
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 689
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_16-04-54_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_16-04-54_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests) 8ms
 ✓ src/cli.spec.ts  (7 tests) 2283ms

 Test Files  2 passed (2)
      Tests  48 passed (48)
   Start at  16:40:26
   Duration  2.63s (transform 57ms, setup 0ms, collect 62ms, tests 2.29s, environment 0ms, prepare 95ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 13 | ×5 | 65 |
| Assignments | 80 | ×6 | 480 |
| **Total Mass** | | | **811** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 215 |
| Functions | 28 |
| Longest Function | 22 lines |
| Avg LOC/Function | 3.82 |
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
| McCabe (Cyclomatic) | 3 | 1.45 | 0 |
| Cognitive (SonarJS) | 3 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 65109038 |
| Context Utilization | 140% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 130.65s |
| Avg Red Phase | 22.15s |
| Avg Green Phase | 24.24s |
| Avg Refactor Phase | 84.26s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 76 |
| Predictions Total | 76 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


