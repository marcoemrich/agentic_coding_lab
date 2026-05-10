# Analysis Report: 2026-05-09_14-31-05_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6-no-thinking

Generated: 2026-05-10T14:58:12+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | sonnet-4-6-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 253s |
| Started | 2026-05-09T14:31:05+00:00 |
| Ended | 2026-05-09T14:35:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, types.ts
- **Implementation LOC** (total): 427
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 485
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_14-31-05_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_14-31-05_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests) 5ms
 ✓ src/cli.spec.ts  (7 tests) 757ms

 Test Files  2 passed (2)
      Tests  47 passed (47)
   Start at  14:58:12
   Duration  1.15s (transform 54ms, setup 0ms, collect 68ms, tests 762ms, environment 0ms, prepare 150ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 63% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 113 | ×1 | 113 |
| Invocations | 137 | ×2 | 274 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 24 | ×5 | 120 |
| Assignments | 87 | ×6 | 522 |
| **Total Mass** | | | **1113** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 331 |
| Functions | 8 |
| Longest Function | 88 lines |
| Avg LOC/Function | 36.00 |
| Median LOC/Function | 25.50 |
| Imports | 3 |

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
| McCabe (Cyclomatic) | 18 | 3.44 | 1 |
| Cognitive (SonarJS) | 20 | 8.57 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1998546 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 21.38s |
| Avg Red Phase | 1.38s |
| Avg Green Phase | 20s |
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


