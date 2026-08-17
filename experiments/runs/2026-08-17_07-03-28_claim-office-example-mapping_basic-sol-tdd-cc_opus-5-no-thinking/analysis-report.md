# Analysis Report: 2026-08-17_07-03-28_claim-office-example-mapping_basic-sol-tdd-cc_opus-5-no-thinking

Generated: 2026-08-17T10:35:43+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 742s |
| Started | 2026-08-17T07:03:28+00:00 |
| Ended | 2026-08-17T07:15:51+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 283
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 704
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_07-03-28_claim-office-example-mapping_basic-sol-tdd-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_07-03-28_claim-office-example-mapping_basic-sol-tdd-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 348ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  10:35:43
   Duration  710ms (transform 40ms, setup 0ms, collect 38ms, tests 348ms, environment 0ms, prepare 56ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 10 | ×5 | 50 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **641** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 221 |
| Functions | 14 |
| Longest Function | 26 lines |
| Avg LOC/Function | 9.57 |
| Median LOC/Function | 8.00 |
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
| McCabe (Cyclomatic) | 5 | 1.86 | 0 |
| Cognitive (SonarJS) | 5 | 2.10 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17445311 |
| Context Utilization | 61% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 31 |
| Avg Cycle Time | 9.37s |
| Avg Red Phase | 3.29s |
| Avg Green Phase | 4.2s |
| Avg Refactor Phase | 1.88s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 28 |
| Predictions Total | 28 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 30 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


