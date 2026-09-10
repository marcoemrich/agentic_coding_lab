# Analysis Report: 2026-09-10_05-35-08_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking

Generated: 2026-09-10T06:41:56+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | fable-5-1-no-thinking |
| Model Version(s) | claude-fable-5-1 |
| Thinking | unknown |
| Duration | 4007s |
| Started | 2026-09-10T05:35:08+00:00 |
| Ended | 2026-09-10T06:41:56+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 229
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 272
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-10_05-35-08_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-10_05-35-08_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 7ms
 ✓ src/cli.spec.ts  (3 tests) 306ms

 Test Files  2 passed (2)
      Tests  45 passed (45)
   Start at  06:41:57
   Duration  613ms (transform 48ms, setup 0ms, collect 51ms, tests 313ms, environment 0ms, prepare 87ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 70 | ×2 | 140 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 6 | ×5 | 30 |
| Assignments | 93 | ×6 | 558 |
| **Total Mass** | | | **834** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 147 |
| Functions | 30 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.03 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 2 | 1.38 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 55860047 |
| Context Utilization | 136% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 45 |
| Avg Cycle Time | 66.78s |
| Avg Red Phase | 10.91s |
| Avg Green Phase | 15.99s |
| Avg Refactor Phase | 39.88s |

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
| Tests Passed Immediately | 23 |


