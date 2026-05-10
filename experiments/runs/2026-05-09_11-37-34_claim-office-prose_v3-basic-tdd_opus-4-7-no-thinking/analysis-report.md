# Analysis Report: 2026-05-09_11-37-34_claim-office-prose_v3-basic-tdd_opus-4-7-no-thinking

Generated: 2026-05-10T14:57:00+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v3-basic-tdd |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 313s |
| Started | 2026-05-09T11:37:34+00:00 |
| Ended | 2026-05-09T11:42:49+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, items.ts, quote.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 367
- **Test file**: claim.spec.ts
- **Test file LOC**: 145
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (27 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_11-37-34_claim-office-prose_v3-basic-tdd_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_11-37-34_claim-office-prose_v3-basic-tdd_opus-4-7-no-thinking

 ✓ src/claim.spec.ts  (8 tests) 3ms
 ✓ src/scenario.spec.ts  (4 tests) 4ms
 ✓ src/quote.spec.ts  (15 tests) 4ms

 Test Files  3 passed (3)
      Tests  27 passed (27)
   Start at  14:57:01
   Duration  386ms (transform 79ms, setup 0ms, collect 106ms, tests 11ms, environment 0ms, prepare 285ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 85 | ×1 | 85 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 12 | ×5 | 60 |
| Assignments | 79 | ×6 | 474 |
| **Total Mass** | | | **867** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 304 |
| Functions | 16 |
| Longest Function | 32 lines |
| Avg LOC/Function | 9.06 |
| Median LOC/Function | 4.50 |
| Imports | 10 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.37 | 0 |
| Cognitive (SonarJS) | 9 | 4.88 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3506393 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 21.28s |
| Avg Red Phase | 0s |
| Avg Green Phase | 21.28s |
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
| Tests Passed Immediately | 0 |


