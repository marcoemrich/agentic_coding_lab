# Analysis Report: 2026-05-09_08-52-55_claim-office-example-mapping_v3-basic-tdd_sonnet-4-6

Generated: 2026-05-10T14:56:25+02:00

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

- **Implementation files**: claims.ts, cli.ts, pricing.ts, types.ts
- **Implementation LOC** (total): 409
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

 ✓ src/pricing.spec.ts  (26 tests) 4ms
 ✓ src/claims.spec.ts  (16 tests) 4ms

 Test Files  2 passed (2)
      Tests  42 passed (42)
   Start at  14:56:26
   Duration  354ms (transform 50ms, setup 0ms, collect 61ms, tests 8ms, environment 0ms, prepare 156ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 62% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 93 | ×1 | 93 |
| Invocations | 123 | ×2 | 246 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 18 | ×5 | 90 |
| Assignments | 77 | ×6 | 462 |
| **Total Mass** | | | **983** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 317 |
| Functions | 9 |
| Longest Function | 81 lines |
| Avg LOC/Function | 28.33 |
| Median LOC/Function | 15.00 |
| Imports | 5 |

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


