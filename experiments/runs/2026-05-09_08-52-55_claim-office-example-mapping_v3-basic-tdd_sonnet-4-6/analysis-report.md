# Analysis Report: 2026-05-09_08-52-55_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6

Generated: 2026-05-09T11:14:49+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | sonnet-4-6 |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 357s |
| Started | 2026-05-09T08:52:55+00:00 |
| Ended | 2026-05-09T08:58:54+00:00 |

## Code Metrics

- **Implementation file**: claims.ts
- **Implementation LOC**: 125
- **Test file**: claims.spec.ts
- **Test file LOC**: 213
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-52-55_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_08-52-55_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6

 ✓ src/pricing.spec.ts  (26 tests) 5ms
 ✓ src/claims.spec.ts  (16 tests) 4ms

 Test Files  2 passed (2)
      Tests  42 passed (42)
   Start at  11:14:50
   Duration  343ms (transform 50ms, setup 0ms, collect 65ms, tests 9ms, environment 0ms, prepare 146ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 62% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 33 | ×1 | 33 |
| Invocations | 48 | ×2 | 96 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 10 | ×5 | 50 |
| Assignments | 24 | ×6 | 144 |
| **Total Mass** | | | **355** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 94 |
| Functions | 4 |
| Longest Function | 67 lines |
| Avg LOC/Function | 26 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 6 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 16 | 4.00 | 2 |
| Cognitive (SonarJS) | 19 | 8.86 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2080673 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 60.38s |
| Avg Red Phase | 28.42s |
| Avg Green Phase | 31.96s |
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


