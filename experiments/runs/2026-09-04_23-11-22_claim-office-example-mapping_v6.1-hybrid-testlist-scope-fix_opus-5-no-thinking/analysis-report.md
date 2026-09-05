# Analysis Report: 2026-09-04_23-11-22_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-09-04T23:52:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2442s |
| Started | 2026-09-04T23:11:22+00:00 |
| Ended | 2026-09-04T23:52:08+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 398
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 761
- **Active tests**: 47
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_23-11-22_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_23-11-22_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (44 tests) 9ms
 ✓ src/cli.spec.ts  (3 tests) 1774ms

 Test Files  2 passed (2)
      Tests  47 passed (47)
   Start at  23:52:09
   Duration  2.30s (transform 97ms, setup 0ms, collect 97ms, tests 1.78s, environment 0ms, prepare 162ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 100 | ×2 | 200 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 14 | ×5 | 70 |
| Assignments | 83 | ×6 | 498 |
| **Total Mass** | | | **892** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 297 |
| Functions | 39 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.51 |
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
| McCabe (Cyclomatic) | 4 | 1.47 | 0 |
| Cognitive (SonarJS) | 4 | 1.41 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 85548772 |
| Context Utilization | 171% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 45 |
| Avg Cycle Time | 92.63s |
| Avg Red Phase | 18.84s |
| Avg Green Phase | 21.45s |
| Avg Refactor Phase | 52.34s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 90 |
| Predictions Total | 90 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 24 |


