# Analysis Report: 2026-05-20_23-32-48_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-7-no-thinking

Generated: 2026-05-23T11:53:00+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.1-testlist-scope-fix |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 4012s |
| Started | 2026-05-20T23:32:48+00:00 |
| Ended | 2026-05-21T00:39:41+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 175
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 658
- **Active tests**: 55
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (55 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-20_23-32-48_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-20_23-32-48_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (55 tests) 3287ms

 Test Files  1 passed (1)
      Tests  55 passed (55)
   Start at  11:53:01
   Duration  3.68s (transform 41ms, setup 0ms, collect 43ms, tests 3.29s, environment 0ms, prepare 82ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 61% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 62 | ×2 | 124 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 9 | ×5 | 45 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **670** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 162 |
| Functions | 9 |
| Longest Function | 43 lines |
| Avg LOC/Function | 10.44 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 6 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 3.58 | 2 |
| Cognitive (SonarJS) | 23 | 7.50 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 18869365 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 55 |
| Avg Cycle Time | 96.71s |
| Avg Red Phase | 33.87s |
| Avg Green Phase | 23.93s |
| Avg Refactor Phase | 38.91s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 85 |
| Predictions Total | 90 |
| Accuracy | 94% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 28 |


