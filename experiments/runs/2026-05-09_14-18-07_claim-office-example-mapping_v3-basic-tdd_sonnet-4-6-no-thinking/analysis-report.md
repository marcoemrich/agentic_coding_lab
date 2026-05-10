# Analysis Report: 2026-05-09_14-18-07_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6-no-thinking

Generated: 2026-05-10T14:57:51+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | sonnet-4-6-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 333s |
| Started | 2026-05-09T14:18:07+00:00 |
| Ended | 2026-05-09T14:23:43+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, items.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 387
- **Test file**: cli.spec.ts
- **Test file LOC**: 165
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_14-18-07_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_14-18-07_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6-no-thinking

 ✓ src/quote.spec.ts  (25 tests) 4ms
 ✓ src/cli.spec.ts  (7 tests) 5ms
 ✓ src/claim.spec.ts  (16 tests) 6ms

 Test Files  3 passed (3)
      Tests  48 passed (48)
   Start at  14:57:51
   Duration  399ms (transform 74ms, setup 0ms, collect 109ms, tests 15ms, environment 0ms, prepare 312ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 100 | ×1 | 100 |
| Invocations | 118 | ×2 | 236 |
| Conditionals | 29 | ×4 | 116 |
| Loops | 21 | ×5 | 105 |
| Assignments | 63 | ×6 | 378 |
| **Total Mass** | | | **935** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 302 |
| Functions | 12 |
| Longest Function | 51 lines |
| Avg LOC/Function | 15.58 |
| Median LOC/Function | 10.50 |
| Imports | 6 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **14** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 12 | 4.00 | 1 |
| Cognitive (SonarJS) | 13 | 4.08 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2896353 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 52.04s |
| Avg Red Phase | 21.43s |
| Avg Green Phase | 30.61s |
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
| Tests Passed Immediately | 2 |


