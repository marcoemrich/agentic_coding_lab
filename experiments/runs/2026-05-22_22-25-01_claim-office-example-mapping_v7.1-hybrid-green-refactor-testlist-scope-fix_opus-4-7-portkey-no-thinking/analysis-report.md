# Analysis Report: 2026-05-22_22-25-01_claim-office-example-mapping_v7.1-hybrid-green-refactor-testlist-scope-fix_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T22:47:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v7.1-hybrid-green-refactor-testlist-scope-fix |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1340s |
| Started | 2026-05-22T22:25:01+00:00 |
| Ended | 2026-05-22T22:47:22+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 269
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 381
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-22_22-25-01_claim-office-example-mapping_v7.1-hybrid-green-refactor-testlist-scope-fix_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-22_22-25-01_claim-office-example-mapping_v7.1-hybrid-green-refactor-testlist-scope-fix_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 6ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  22:47:23
   Duration  188ms (transform 47ms, setup 0ms, collect 46ms, tests 6ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 63 | ×2 | 126 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 10 | ×5 | 50 |
| Assignments | 84 | ×6 | 504 |
| **Total Mass** | | | **798** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 221 |
| Functions | 13 |
| Longest Function | 19 lines |
| Avg LOC/Function | 9.08 |
| Median LOC/Function | 8.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 5 | 2.44 | 0 |
| Cognitive (SonarJS) | 6 | 2.46 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 20513627 |
| Context Utilization | 15% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 114.44s |
| Avg Red Phase | 24.57s |
| Avg Green Phase | 41.87s |
| Avg Refactor Phase | 48s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 18 |
| Predictions Total | 18 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


