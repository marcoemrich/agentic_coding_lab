# Analysis Report: 2026-09-10_05-35-21_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking

Generated: 2026-09-10T06:47:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | fable-5-1-no-thinking |
| Model Version(s) | claude-fable-5-1 |
| Thinking | unknown |
| Duration | 4357s |
| Started | 2026-09-10T05:35:21+00:00 |
| Ended | 2026-09-10T06:47:59+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 265
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 282
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-10_05-35-21_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-10_05-35-21_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_fable-5-1-no-thinking

 ✓ src/claim-office.spec.ts  (41 tests) 8ms
 ✓ src/cli.spec.ts  (3 tests) 882ms

 Test Files  2 passed (2)
      Tests  44 passed (44)
   Start at  06:48:00
   Duration  1.19s (transform 48ms, setup 0ms, collect 52ms, tests 890ms, environment 0ms, prepare 84ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 81 | ×2 | 162 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 10 | ×5 | 50 |
| Assignments | 97 | ×6 | 582 |
| **Total Mass** | | | **895** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 173 |
| Functions | 38 |
| Longest Function | 15 lines |
| Avg LOC/Function | 3.47 |
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
| McCabe (Cyclomatic) | 3 | 1.28 | 0 |
| Cognitive (SonarJS) | 3 | 1.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 68473309 |
| Context Utilization | 142% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 70.31s |
| Avg Red Phase | 11.41s |
| Avg Green Phase | 15.67s |
| Avg Refactor Phase | 43.23s |

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
| Refactorings Applied | 28 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


