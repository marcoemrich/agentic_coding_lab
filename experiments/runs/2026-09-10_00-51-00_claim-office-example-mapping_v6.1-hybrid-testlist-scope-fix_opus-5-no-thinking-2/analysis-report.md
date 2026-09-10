# Analysis Report: 2026-09-10_00-51-00_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-2

Generated: 2026-09-10T01:27:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2188s |
| Started | 2026-09-10T00:51:00+00:00 |
| Ended | 2026-09-10T01:27:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 383
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 762
- **Active tests**: 47
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-10_00-51-00_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-10_00-51-00_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-2

 ✓ src/claim-office.spec.ts  (47 tests) 590ms

 Test Files  1 passed (1)
      Tests  47 passed (47)
   Start at  01:27:30
   Duration  783ms (transform 48ms, setup 0ms, collect 62ms, tests 590ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 16 | ×5 | 80 |
| Assignments | 89 | ×6 | 534 |
| **Total Mass** | | | **873** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 277 |
| Functions | 29 |
| Longest Function | 13 lines |
| Avg LOC/Function | 3.38 |
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
| McCabe (Cyclomatic) | 3 | 1.30 | 0 |
| Cognitive (SonarJS) | 4 | 1.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 73377982 |
| Context Utilization | 148% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 47 |
| Avg Cycle Time | 83.70s |
| Avg Red Phase | 14.54s |
| Avg Green Phase | 15.5s |
| Avg Refactor Phase | 53.66s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 96 |
| Predictions Total | 96 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 25 |


