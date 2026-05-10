# Analysis Report: 2026-05-09_14-06-03_claim-office-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking

Generated: 2026-05-10T14:57:28+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | haiku-4-5-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 351s |
| Started | 2026-05-09T14:06:03+00:00 |
| Ended | 2026-05-09T14:11:56+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, quotes.ts
- **Implementation LOC** (total): 407
- **Test file**: claims.spec.ts
- **Test file LOC**: 202
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_14-06-03_claim-office-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_14-06-03_claim-office-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking

 ✓ src/cli.spec.ts  (4 tests) 3ms
 ✓ src/quotes.spec.ts  (21 tests) 4ms
 ✓ src/claims.spec.ts  (16 tests) 5ms

 Test Files  3 passed (3)
      Tests  41 passed (41)
   Start at  14:57:29
   Duration  366ms (transform 69ms, setup 0ms, collect 96ms, tests 12ms, environment 0ms, prepare 244ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 64% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 77 | ×1 | 77 |
| Invocations | 111 | ×2 | 222 |
| Conditionals | 25 | ×4 | 100 |
| Loops | 24 | ×5 | 120 |
| Assignments | 78 | ×6 | 468 |
| **Total Mass** | | | **987** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 304 |
| Functions | 10 |
| Longest Function | 55 lines |
| Avg LOC/Function | 13.90 |
| Median LOC/Function | 10.50 |
| Imports | 3 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 9 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **12** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 16 | 4.29 | 3 |
| Cognitive (SonarJS) | 25 | 9.50 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10179161 |
| Context Utilization | 51% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 39.76s |
| Avg Red Phase | 15.04s |
| Avg Green Phase | 24.72s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


