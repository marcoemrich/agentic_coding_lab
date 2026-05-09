# Analysis Report: 2026-05-09_08-39-14_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6

Generated: 2026-05-09T11:14:29+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | sonnet-4-6 |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 350s |
| Started | 2026-05-09T08:39:14+00:00 |
| Ended | 2026-05-09T08:45:06+00:00 |

## Code Metrics

- **Implementation file**: claim.ts
- **Implementation LOC**: 119
- **Test file**: claim.spec.ts
- **Test file LOC**: 175
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-39-14_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-39-14_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6

 ✓ src/claim.spec.ts  (16 tests) 4ms
 ✓ src/quote.spec.ts  (26 tests) 3ms

 Test Files  2 passed (2)
      Tests  42 passed (42)
   Start at  11:14:29
   Duration  355ms (transform 54ms, setup 0ms, collect 57ms, tests 7ms, environment 0ms, prepare 225ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 68% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 31 | ×1 | 31 |
| Invocations | 39 | ×2 | 78 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 9 | ×5 | 45 |
| Assignments | 23 | ×6 | 138 |
| **Total Mass** | | | **332** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 88 |
| Functions | 4 |
| Longest Function | 80 lines |
| Avg LOC/Function | 25 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 7 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 20 | 3.84 | 2 |
| Cognitive (SonarJS) | 28 | 6.15 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1892409 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 70.61s |
| Avg Red Phase | 30.95s |
| Avg Green Phase | 39.66s |
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


