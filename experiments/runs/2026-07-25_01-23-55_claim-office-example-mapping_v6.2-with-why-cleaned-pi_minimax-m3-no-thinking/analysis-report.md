# Analysis Report: 2026-07-25_01-23-55_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3-no-thinking

Generated: 2026-07-25T13:05:49+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | minimax-m3-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 7078s |
| Started | 2026-07-25T01:23:55+00:00 |
| Ended | 2026-07-25T03:21:54+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 325
- **Test file**: cli.spec.ts
- **Test file LOC**: 93
- **Active tests**: 3
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_01-23-55_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_01-23-55_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3-no-thinking

 ✓ src/claim.spec.ts  (15 tests) 4ms
 ✓ src/quote.spec.ts  (24 tests) 5ms
 ✓ src/scenario.spec.ts  (3 tests) 3ms
 ✓ src/cli.spec.ts  (3 tests) 488ms

 Test Files  4 passed (4)
      Tests  45 passed (45)
   Start at  13:05:54
   Duration  859ms (transform 124ms, setup 0ms, collect 173ms, tests 500ms, environment 1ms, prepare 408ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 16 | ×5 | 80 |
| Assignments | 74 | ×6 | 444 |
| **Total Mass** | | | **831** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 253 |
| Functions | 15 |
| Longest Function | 30 lines |
| Avg LOC/Function | 10.73 |
| Median LOC/Function | 8.00 |
| Imports | 7 |

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
| McCabe (Cyclomatic) | 4 | 2.50 | 0 |
| Cognitive (SonarJS) | 7 | 2.43 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 19487070 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 12 |
| Predictions Total | 12 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


