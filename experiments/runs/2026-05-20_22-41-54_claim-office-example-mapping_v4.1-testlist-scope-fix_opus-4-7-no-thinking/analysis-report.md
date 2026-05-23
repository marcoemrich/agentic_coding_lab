# Analysis Report: 2026-05-20_22-41-54_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-7-no-thinking

Generated: 2026-05-23T11:52:47+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.1-testlist-scope-fix |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3034s |
| Started | 2026-05-20T22:41:54+00:00 |
| Ended | 2026-05-20T23:32:29+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 138
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 503
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-20_22-41-54_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-20_22-41-54_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (50 tests) 901ms

 Test Files  1 passed (1)
      Tests  50 passed (50)
   Start at  11:52:48
   Duration  1.30s (transform 41ms, setup 0ms, collect 35ms, tests 901ms, environment 0ms, prepare 86ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 64% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 53 | ×2 | 106 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 11 | ×5 | 55 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **589** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 125 |
| Functions | 4 |
| Longest Function | 34 lines |
| Avg LOC/Function | 26.50 |
| Median LOC/Function | 32.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **16** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 15 | 5.86 | 2 |
| Cognitive (SonarJS) | 21 | 7.33 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12241565 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 94.60s |
| Avg Red Phase | 32.89s |
| Avg Green Phase | 24.41s |
| Avg Refactor Phase | 37.3s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 68 |
| Predictions Total | 75 |
| Accuracy | 90% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 29 |


